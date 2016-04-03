var events=require("events");
var http = require("http");
var EventEmitter = require('events').EventEmitter;
var TweetFactory = require('./tweetfactory');
var Common = require('./common'),
	Tools = Common.tools;

var TwitterSearcher = function(twitterAPI){
	EventEmitter.call(this);
	this.lastestTweet = 0;
	this.finishedRequests = 0;
	this.tweetList = [];
	this.twitterAPI = twitterAPI;
	this.receiveTweets = Tools.bind(this.receiveTweets, this);
	this.onFinishedRequest = Tools.bind(this.onFinishedRequest, this);

}

TwitterSearcher.prototype = Object.create(EventEmitter.prototype);


TwitterSearcher.prototype.search = function(placeName, lat, lng)
{	
	this.searchByName(placeName);
	this.searchByLocation(lat, lng);
}



TwitterSearcher.prototype.searchByName = function(placeName)
{
	var body = this.prepareSearchQuery(placeName);
	this.request(body);
}


TwitterSearcher.prototype.searchByLocation = function(lat, lng)
{
	var body = this.prepareSearchQueryWithGeo(lat,lng);
	this.request(body);
}



TwitterSearcher.prototype.prepareSearchQuery = function(placeName){
	return {
		q: placeName + ' ' + Common.twitterSearchKeywords.join(' OR ')
	}
}


TwitterSearcher.prototype.prepareSearchQueryWithGeo = function(lat, lng){
	return {
		q: Common.twitterSearchKeywords.join(' OR '),
		geocode: lat + ',' + lng + ',150km'
	};
}

TwitterSearcher.prototype.request = function(body)
{
	this.twitterAPI.get('search/tweets', body, this.receiveTweets.bind(this));
}

TwitterSearcher.prototype.receiveTweets = function(error, tweets, response)
{
	var self = this;
	var body = "";
	if (tweets && tweets.statuses && tweets.statuses.length > 0) {
		self.addToTweetList(tweets.statuses);
	}
	self.finishedRequests++;
	self.onFinishedRequest();
};

TwitterSearcher.prototype.onFinishedRequest = function() {
	
	if(this.nameAndLocationRequestsFinished()){ 
		if(this.tweetList.length > 0){	
			this.sortTweetList();			
			this.emit("tweets",this.tweetList);			
		}
		else{
			this.emit("noTweets");
		}
		this.removeAllListeners("tweets");
	}
};

TwitterSearcher.prototype.nameAndLocationRequestsFinished = function() {
	return this.finishedRequests == 2;
};

TwitterSearcher.prototype.addToTweetList = function(jsonData)
{	
	for(var i in jsonData){		
		var tweet = TweetFactory.create(jsonData[i]);	
		this.tweetList.push(tweet);		
	}
}

TwitterSearcher.prototype.sortTweetList = function() {	
	this.tweetList.sort(function(a,b) {
		aTime = Date.parse(a.timeStamp);
		bTime = Date.parse(b.timeStamp);
		return bTime-aTime});
};


module.exports = TwitterSearcher;