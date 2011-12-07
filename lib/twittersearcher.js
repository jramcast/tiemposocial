var events=require("events");
var http = require("http");
var EventEmitter = require('events').EventEmitter;
var TweetFactory = require('./tweetfactory');
var Common = require('./common'),
	Tools = Common.tools;

var TwitterSearcher = function(config, socketManager){
	EventEmitter.call(this);
	this.lastestTweet = 0;
	this.finishedRequests = 0;
	this.tweetList = [];
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
	var query = this.prepareSearchQuery(placeName);
	this.request(query);	
}


TwitterSearcher.prototype.searchByLocation = function(lat, lng)
{
	var query = this.prepareSearchQueryWithGeo(lat,lng);	
	this.request(query);	
}



TwitterSearcher.prototype.prepareSearchQuery = function(placeName){
	return encodeURIComponent(placeName + ' ' + Common.twitterSearchKeywords.join(' OR '));
}


TwitterSearcher.prototype.prepareSearchQueryWithGeo = function(lat, lng){
	return encodeURIComponent(Common.twitterSearchKeywords.join(' OR ')) + '&geocode=' + lat + ',' + lng + ',150km';
}

TwitterSearcher.prototype.request = function(query)
{
	var self = this;		
	var request = this.executeSearch(query);
	request.on("response", this.receiveTweets);
	request.end();	
}


TwitterSearcher.prototype.executeSearch = function(query)
{
	var q = query+ '&rpp=10&result_type=recent';
	console.log('search.twitter.com/search.json?q='+q);
	return http.request({
		host: "search.twitter.com",
		port: 80,
		method: "GET",
		path: "/search.json?q=" + q
	});
}

TwitterSearcher.prototype.receiveTweets = function(response)
{
	var self = this;
	var body = "";
	response.on("data", function(data){
		body += data;					
		try {
			var tweets = JSON.parse(body);
			if (tweets.results.length > 0) {
				self.addToTweetList(tweets.results);
			}			
			self.finishedRequests++;
			self.onFinishedRequest();	
		} 
		catch (ex) {
			console.log("waiting for more data chunks..." + ex);
		}
	});
}

TwitterSearcher.prototype.onFinishedRequest = function() {
	
	if(this.nameAndLocationRequestsFinished()){ 
		if(this.tweetList.length > 0){	
			this.sortTweetList();			
			this.emit("tweets",this.tweetList);			
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