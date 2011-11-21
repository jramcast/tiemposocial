var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;
var app = require('../app'),
    assert = require('assert');


module.exports = {

	'GET /': function(){
	   	assert.response(app, 
			{
		    	url: '/',
				method: 'GET'
			},
			function(res) {				
				res.body.should.include.string('Node.js');
			});
	},

	
	'POST /places/search': function(){			
	   	assert.response(app, 
			{
		    	url: '/places/search',
				method: 'POST',
				
			},
			function(res) {				
				res.body.should.include.string('TypeError: Cannot read property'); 
			});
	},
	
	
}
	
	