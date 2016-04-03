var events = require('events');
var util = require('util');
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var TweetFactory = require('./tweetfactory');
var	Common = require('./common');
var	Tools = Common.tools;


var TwitterFeeder = function(twitterNode){
	EventEmitter.call(this);	
	this.twitterNode = twitterNode;
	this.onTweet = Tools.bind(this.onTweet, this);
};

TwitterFeeder.prototype = Object.create(EventEmitter.prototype);

TwitterFeeder.prototype.endStream = function() {
	this.twitterNode.removeListener('tweet', this.onTweet);
}

TwitterFeeder.prototype.search = function(placeName, lat, lng) {
	var self = this;
	this.placeName = placeName;
	this.lat = lat;
	this.lng = lng;

	this.twitterNode.stream('statuses/filter',
		{track: Common.twitterStreamKeywords.join()},
		function(stream) {
			stream.on('data', self.onTweet);
	    stream.on('error', function(error) {
	      console.error("Error in streaming api: " + error.message);
	    });
		}
	);
};

TwitterFeeder.prototype.onTweet = function(tweet) {
	if(	this.tweetContainsPlaceName(tweet,this.placeName) ||
		this.tweetIsLocatedNear(tweet,this.lat,this.lng)	)
		{
			var tweet = TweetFactory.create(tweet);
			this.emit('tweet', tweet);
		}
}



TwitterFeeder.prototype.tweetContainsPlaceName = function(tweet, placeName) {
	
	var text = this.simplifyString(tweet.text);
	var userName = this.simplifyString(tweet.user.screen_name || tweet.user.name);
	var locationName = '';
	var userLocation = '';
	if(tweet.place && tweet.place.full_name){
		locationName = this.simplifyString(tweet.place.full_name);
		//console.log(locationName);
	}
	
	if(tweet.user && tweet.user.location){
		userLocation = this.simplifyString(tweet.user.location);
		//console.log('User location: ' + userLocation);
	}
		
	placeName = this.simplifyString(placeName);
	
	if (Tools.stringContains(text,placeName) ||
		Tools.stringContains(locationName,placeName) ||
		Tools.stringContains(userName,placeName) ||
		Tools.stringContains(userLocation,placeName)){			
		console.log('>>>>>>> !!!!!!!!!!TWEET RELATED con ' + placeName);
		return true;
	}
	
	console.log('NOT ABOUT ' + placeName); //+'('+text+')');
	return false;
}



TwitterFeeder.prototype.tweetIsLocatedNear = function(tweet,lat,lng) {

	var r = 1; //margin in degrees
	if(tweet.geo && tweet.geo.coordinates)
	{
		console.log('>>> Found coordinates!!!!!!! ' + tweet.geo.coordinates);
		var thisLat = tweet.geo.coordinates[0];
		var thisLng = tweet.geo.coordinates[1];
		
		if(thisLat >= lat-r && thisLat <= lat+r && thisLng >= lng-r && thisLng <= lng+r){
			console.log('>>>>>>> !!!!!!!!!! Found nearby location!!!!!!!');
			return true;
		}
	}
	//console.log('Not this location');
	return false;
}


TwitterFeeder.prototype.simplifyString = function(string) {
	string = string.replace("á", "a");
	string = string.replace("é", "e");
	string = string.replace("í", "i");
	string = string.replace("ó", "o");
	string = string.replace("ú", "u");
	string = string.toLowerCase();
	
	return string;	
};


module.exports = TwitterFeeder;