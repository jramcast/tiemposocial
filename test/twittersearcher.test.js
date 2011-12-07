var TwitterSearcher = require('../lib/twittersearcher.js');
var TweetFactory = require('../lib/tweetfactory');
var should = require('./testcommon').should;


var config = {user: "jramcast", password: "ninonino83", action: "filter", track: ['spain']};



module.exports = {		
	"searchByName(placeName)" : function(beforeExit, assert) 
	{				
		var twitterSearcher = new TwitterSearcher();
		var results = null;

		twitterSearcher
		.on("tweets", function(tweets){			
	        results = tweets; 
		})
		.searchByName('Madrid');
		
		beforeExit(function() 
		{
			for(var i in results)
			{			
				var allText = results[i].text + results[i].location + results[i].from_user;
				allText.should.include.string('Madrid');
				should.exist(results[i].created_at);
			}	
		});		
	},
	
	
	"searchByLocation(placeName)" : function(beforeExit, assert) 
	{			
		var twitterSearcher = new TwitterSearcher();
		var results = null;

		twitterSearcher
		.on("tweets", function(tweets){			
	        results = tweets; 
		})
		.searchByLocation(38.95, -1.85);
		
		beforeExit(function() 
		{			
			for(var i in results) 
			{
				should.exist(results[i].text);
				should.exist(results[i].location);
				should.exist(results[i].from_user);
				should.exist(results[i].created_at);
			}				
		});		
	},
	
	
	"sortTweetList" : function(attribute){
		var twitterSearcher = new TwitterSearcher();

		twitterSearcher.tweetList[0] = TweetFactory.create({text: '2', created_at:'2011-11-9 10:20:23' , from_user: 'test'});
		twitterSearcher.tweetList[1] = TweetFactory.create({text: '1', created_at:'2011-11-17 9:20:54' , from_user: 'test'});
		twitterSearcher.tweetList[2] = TweetFactory.create({text: '0', created_at:'2011-11-17 11:34:23' , from_user: 'test'});
		twitterSearcher.sortTweetList();		
		twitterSearcher.tweetList.length.should.eql(3);
		for(var i in twitterSearcher.tweetList){
			twitterSearcher.tweetList[i].text.should.eql(i);
		}
	},
};
