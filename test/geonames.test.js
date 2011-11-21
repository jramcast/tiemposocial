var GeoNames = require('../lib/geonames');
var TestCommon = require('./testcommon'),
	testConfig = TestCommon.config,
	should = TestCommon.should;


module.exports = {	
		
	"search(placeName)" : function(beforeExit, assert) {		
		var geoNames = new GeoNames();
		var results = null;
		
		geoNames
		.on('placesFound', function(places) {			
			results = places;
		})	
		.search('Albacete');
		
		beforeExit(function() {
			var mainResult = results[0];
			should.exist(mainResult.name); 
			should.exist(mainResult.adminName1); 
			should.exist(mainResult.countryName);		
		});
	},
	
	"search(wrongPlace)" : function(beforeExit, assert) {		
		var geoNames = new GeoNames();
		var notFound = false;
		
		geoNames
		.on('placeNotFound', function() {			
			notFound = true;
		})	
		.search('ñlaksbjoisadb');
		
		beforeExit(function() {
			notFound.should.be.true;	
		});
	},
	
	"searchWeatherStations(lat,long)" : function(beforeExit, assert) {		
		var geoNames = new GeoNames();
		var results = null;
		
		geoNames
		.on('weatherStationsFound', function(stations) {			
			 results = stations;
		})	
		.searchWeatherStations(39.53, 2.71); //Coordenadas de Palma
		
		beforeExit(function() {
			var mainResult = results[0];
			should.exist(mainResult.stationName); 
			should.exist(mainResult.temperature); 
			should.exist(mainResult.humidity);		
		});
	},
};
