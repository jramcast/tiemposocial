var ClientFactory = require('../lib/clientfactory');
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;
	



module.exports = {			
	"test searchNearby(lat,lng) FOUND NEARBY" : function() {		
		var list = new ClientFactory();
		list.create();
		list.clients[0].places = [];
		list.clients[0].places.push({lat: 1.3, lng: 3, name: 'test1'});
		
		list.create();
		list.clients[1].places = [];
		list.clients[1].places.push({lat: 1.34, lng: 3.23, name: 'test2'});		
		var nearby = list.searchNearbyClients(list.clients[0]);
		nearby[0].should.eql(list.clients[1]);
	},	
	
	"test searchNearby(lat,lng) NOT FOUND NEARBY" : function() {		
		var list = new ClientFactory();
		list.create();
		list.clients[0].places = [];
		list.clients[0].places.push({lat: 0.8, lng: 5, name:'asdfgas'});
		
		list.create();
		list.clients[0].places = [];
		list.clients[0].places.push({lat: 3.8, lng: 5, name:'asdfgas'});
		var nearby = list.searchNearbyClients(list.clients[0]);
		nearby.should.be.empty;
	},
	
	"test notifications to nearby clients" : function(beforeExit) {
		var list = new ClientFactory();
		var notification = null;
		list.create();
		list.clients[0].places = [];
		list.clients[0].places.push({lat: 1, lng: 3, name: 'initial'});
		list.clients[0].on('nearbyClients', function(nearbyClients) {
			
			notification = nearbyClients[0].mainPlace();
		});
		
		list.create();
		list.clients[1].places = [];
		list.clients[1].places.push({lat: 1.2, lng: 2.3, name: 'nearby'});
		list.clients[1].emit('placeCheckedInGeoNames');
		
		beforeExit(function() {
			notification.name.should.eql('nearby');	
			notification.lat.should.eql(1.2);	
			notification.lng.should.eql(2.3);	
		});
	},
	
	"test discard client": function() {
		var list = new ClientFactory();
		var notification = null;
		list.create();
		list.clients[0].places = [];
		list.clients[0].places.push({lat: 1, lng: 3});
		
		list.create();
		list.clients[1].places = [];
		list.clients[1].places.push({lat: 1.2, lng: 2.3, name: 'nearby'});
		var remaining = list.clients[1]
		
		list.discard(list.clients[0]);
		
		list.clients[0].should.be.eql(remaining);

	}
};
