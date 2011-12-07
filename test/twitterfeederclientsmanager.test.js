var SocketsManager = require('../lib/twitterfeederclientsmanager');
var TwitterFeeder = require('../lib/twitterfeeder');
var app = require('../server');
var Io = require('socket.io')
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;


module.exports = {	
		
	"addclient(feeder, socket)" : function() {		
		var m = app.socketManager.twitterFeederClientsManager;	
		var id = 235325;
		var testSocket = createTestSocket(id);
		var testFeeder = new TwitterFeeder(app.twitterNode);
		m.addClient(testFeeder, testSocket);
		should.exist(m.clients[id]);
		m.getClient(id).should.eql(testFeeder);
	},	
};


function createTestSocket(id) {
	var testManager = {
		store: {
			client: function() {}
		}
	};
	return new Io.Socket (testManager, id, {name : 'test'}, true);
};
