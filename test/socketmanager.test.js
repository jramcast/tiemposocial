var SocketsManager = require('../lib/socketsmanager');
var TwitterFeeder = require('../lib/twitterfeeder');
var app = require('../server');
var Io = require('socket.io')
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;


module.exports = {	
		
	"addclient(feeder, socket)" : function(beforeExit, assert) {		
		var s = app.socketManager;	
		var id = 235325;
		var testSocket = createTestSocket(id);
		var testFeeder = new TwitterFeeder(app.twitterNode);
		s.addClient(testFeeder, testSocket);
		should.exist(s.clients[id]);
		s.clients[id].should.eql(testFeeder);
	}
};


function createTestSocket(id) {
	var testManager = {
		store: {
			client: function() {}
		}
	};
	return new Io.Socket (testManager, id, {name : 'test'}, true);
};
