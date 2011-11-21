var Tweets = function() {
	this.tweetTimes = [];
	this.tweets = 0;
};

Tweets.prototype.listen = function() {
	
	this.initTwitterFeedListener();
	this.initTwitterSearchListener();
	var self = this;
	setInterval(function() {
		return self.updateTweetTimes.call(self);
	}, 30000);
};


Tweets.prototype.initTwitterFeedListener = function() {
	var self = this;
	socket.on('liveTweetFound', function(tweet) {
		if($('#waiting_message')) $('#waiting_message').remove();
		self.showTweet(tweet);
    });
}  

Tweets.prototype.initTwitterSearchListener = function() {
	var self = this;
	socket.on('previousTweetsFound', function(data) {
		$('#waiting_message').remove();
		reverseI = data.length - 1;
		for(var i in data){
			var tweet = data[reverseI - i];
			self.showTweet.call(self,tweet);		
		}
	});
};

Tweets.prototype.showTweet = function(tweet) {
	var tweetHtml = this.generateTweetHtml(tweet)
	$("<li></li>").html(tweetHtml).prependTo("ul#tweets").css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
	this.addTweetTimeStamp(tweet.timeStamp);
};

Tweets.prototype.generateTweetHtml = function(tweet) {
	var text = setLinks(tweet.text);	
	var html = 	"<div class='tweet_text'>" + text + "</div>";
	html += 	"<div class='row'>";
	html += 	"	<div class='col col_4'><div class='tweet_user'>" + tweet.user + "</div></div>";	
	html +=		"	<div class='col col_5'><div id='tweet_date"+this.tweets+"' class='tweet_date'>" + TwitterDateFormater.since(tweet.timeStamp) + "</div></div>";
	html +=		"	<div class='clear'></div>";
	html += 	"</div>";
	html +=		(tweet.location) ? "<div class='tweet_location'> Cerca de " + tweet.location + "</div>" : "";
	return html;
};


Tweets.prototype.addTweetTimeStamp = function(t) {
	this.tweets++;
	this.tweetTimes.push(t);
};

Tweets.prototype.updateTweetTimes = function() {
	for(var i in this.tweetTimes) {
		$("#tweet_date"+i).html(TwitterDateFormater.since(this.tweetTimes[i]));
	}	
};


