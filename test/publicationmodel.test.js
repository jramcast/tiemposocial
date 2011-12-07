var Publication = require('../lib/models/publicationmodel');
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;
	



module.exports = {		
	"test save publication" : function(beforeExit) {
		var publication = new Publication({	user: 'Alguien',
		 									text: 'message.data', 
											timeStamp: new Date(), 
											location: { name: 'balbla',
														lat: "23", 
														lng: "90"
													  }
											}
										);
		var saved = false;
		publication
		.on('saved', function() {
			saved = true;
		})
		.save();		
		
		beforeExit(function() {
			saved.should.be.true;
		});
		
		
	},
	
/*	"test save long publication" : function(beforeExit) {
		var i = 0;
		var text = '';
		while(i<600){
			text += 'a';
			i++;
		}	
		
		var saved = false;
		var publication = new Publication({user: 'Alguien', text: text, timeStamp: new Date(), 
											location: { name: 'location',
														lat: "23", 
														lng: "90"
											}});		
		publication.text.should.have.lengthOf(500);	
		
		publication
		.on('saved', function() {
			saved = true;
		})
		.save();		
		
		beforeExit(function() {
			saved.should.be.true;
		});	
	},*/
	
	"test get recent" : function(beforeExit) {
		var recent = false;
		
		Publication.recent(function(recentPubs) {
			recent = recentPubs;
		});

		beforeExit(function() {
			recent.length.should.be.above(0);
		});
	},
	
	
};