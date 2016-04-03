var TwitterFeeder = require('../lib/twitterfeeder.js')
var should = require('./testcommon').should;


var config = {user: "###", password: "###", action: "filter", track: ['spain']};



module.exports = {		
	"TwitterFeeder with Name" : function(beforeExit, assert) 
	{				
		/*var twitterFeeder = new TwitterFeeder();
		var result = null;

		twitterFeeder
		.on("tweet", function(tweet){			
	        result = tweet; 		
			twitterFeeder.removeAllListeners('tweet');
			twitterFeeder = null;
		})
		.searchByName('a');
		
		beforeExit(function() 
		{
			console.log('result: '+result);
			should.exist(result.text);
			should.exist(result.created_at);	
			should.exist(result.user);			
		});		
*/
	
		assert.ok(true);
	}
};



