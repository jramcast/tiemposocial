var Client = require('../lib/client');
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;
	

module.exports = {	
	
	/*"test checkplace" : function(beforeExit) {
		var client = new Client();
		var results = null;
		client
		.on('placeCheckedInGeoNames', function(places) {
			results =  places;
		})		
		.checkPlace('Madrid España');
		
		beforeExit(function() {
			results[0].should.eql('Madrid');	
		});
	},
	
	"test checkplace caracter raro" : function(beforeExit) {
		var client = new Client();
		var results = null;
		client
		.on('placeCheckedInGeoNames', function(places) {
			results =  places;
		})		
		.checkPlace('Deiá');
		
		beforeExit(function() {
			results[0].should.eql('Deiá');	
		});
	},
	
	"test checkplace doesnt find place" : function(beforeExit) {
		var client = new Client();
		var found = true;
		client
		.on('placeNotFoundInGeoNames', function(places) {
			found = false;
		})		
		.checkPlace('nameñalsdfasdvAS_DF23432qfewlñkfajsdf');		
		beforeExit(function() {
			found.should.be.false;
		});
	},
	
	"test weather stations found" : function(beforeExit) {
		var client = new Client();
		var stations = null;
		client
		.on('weatherStationsFound', function(sts) {
			stations = sts;
		})	
		.checkPlace('Madrid');		
		beforeExit(function() {
			should.exist(stations[0].temperature);
		});
	},
	
	"test weather stations NOT found" : function(beforeExit) {
		var client = new Client();
		var found = true;
		client
		.on('weatherStationsNotFound', function() {
			found = false;
		})	
		.checkPlace('ñlajsdfañsiefaw09g239agw3bgagiwsidof');		
		beforeExit(function() {
			found.should.be.false;
		});
	},*/
	
	"test disconnection" : function() {
		var client = new Client();
		//tengo que mirar como se comprueban los listeners
	},
	
	"test send publication to nearby clients" : function() {
		var client1 = new Client();
		var client2 = new Client();
		var publication = 'hola';
		client2.on('publicationNearby', function(pub) {
			pub.should.be.eql(publication);
		})
		client1.nearbyClients = [client2];
		client1.sendPublicationToNearbyClients(publication);
	},
	
	"test change place" : function() {
		var client = new Client();
		var results = null;
		client
		.on('placeCheckedInGeoNames', function(places) {
			var wanted = client.places[1];
			client.changePlace(1);
			client.mainPlace().should.eql(wanted);
		})		
		.checkPlace('Madrid España');
	},
	
	
	
}