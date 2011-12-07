var Tweet = function(json) {	
	this.text =	json.text,
	this.timeStamp =  json.created_at, 
	this.setLocation(json);
	this.type = "tweet";
};


var LiveTweet = function(json) {
	Tweet.call(this,json);	
	this.user =  json.user.screen_name;
};

LiveTweet.prototype = Object.create(Tweet.prototype);

LiveTweet.prototype.setLocation = function(json) {
	if(json.place && json.place.full_name)
		this.location = json.place.full_name;
	else 
		this.location = '';
};






var PreviousTweet = function(json) {
	Tweet.call(this,json);	
	this.setLocation(json);
	this.user =  json.from_user;
};
PreviousTweet.prototype = Object.create(Tweet.prototype);

PreviousTweet.prototype.setLocation = function(json) {
	if(json.location)
		this.location = json.location;
	else 
		this.location = '';
};







var TweetFactory = function(){};

TweetFactory.create = function(json){
	
	if(json.user && json.user.screen_name) {
		return new LiveTweet(json);
	}
	
	else if (json.from_user) {
		return new PreviousTweet(json);	
	}
	
	else throw new Error('TweetFactory.create(): Invalid tweet json!!!');		
}

module.exports = TweetFactory;
