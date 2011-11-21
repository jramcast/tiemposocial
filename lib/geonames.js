var  EventEmitter = require('events').EventEmitter;
var http = require("http");
var Common = require('./common');
	Tools = Common.tools;


var GeoNames = function() {
  	EventEmitter.call(this);
	this.receivePlaces = Tools.bind(this.receivePlaces, this);
	this.receiveWeatherStations = Tools.bind(this.receiveWeatherStations, this);
};

GeoNames.prototype = Object.create(EventEmitter.prototype);


GeoNames.prototype.search = function(placeName) {
		
	if(placeName)
	{	
		var self = this;		
		var query = this.prepareSearchQuery(placeName);		
		var request =  this.executeSearch(query);
		request.on("response", this.receivePlaces);
		request.end();
	}	
	else 
		this.emit('placeNotFound');		
};

//http://api.geonames.org/weather?north=39.5&south=38.5&east=-1&west=-2&username=jramcast
GeoNames.prototype.searchWeatherStations = function(latitude, longitude) {
		
		var query = this.prepareWeatherStationSearchQuery(latitude, longitude);	
		var request =  this.executeSearch(query);		
		request.on("response", this.receiveWeatherStations);
		request.end();

};

GeoNames.prototype.prepareSearchQuery = function(placeName) {
	var baseUri = "/searchJSON?q=";
	var options = "&featureClass=P&lang=es&maxRows=10&"; //P significa pueblo o ciudad (sitio poblado)
	var username = "username=jramcast";
	//Ejemplo:	http://api.geonames.org/search?q=albacete&featureClass=P&maxRows=4&username=jramcast
	return baseUri + escape(placeName) + options + username;
}


GeoNames.prototype.prepareWeatherStationSearchQuery = function(latitude, longitude) {	
	var latitude = parseFloat(latitude);
	var longitude = parseFloat(longitude);
	var north = latitude + 0.5;
	var south = latitude - 0.5;
	var east = longitude + 0.5;
	var west = longitude - 0.5;
	var baseUri = "/weatherJSON?";
	var box = "north=" + north + "&south=" + south  + "&east=" + east  + "&west=" + west  + "&";
	var username = "username=jramcast";	
	var lang = "&lang=es";
	return baseUri + box + username + lang;
}


GeoNames.prototype.executeSearch = function(query)
{
	return http.request({
		host: "api.geonames.org",
		port: 80,
		method: "GET",
		path: query
	});
}


GeoNames.prototype.receivePlaces = function(response)
{
	var self = this;
	var body = "";
	response.on("data", function(data){		
		body += data;		
		try {
			var places = JSON.parse(body);	
			if (places.totalResultsCount && places.totalResultsCount > 0) {						
				self.emit("placesFound", places.geonames);
			}	
			else{ 
				self.emit('placeNotFound');
			}
			self.removeAllListeners("placesFound"); //esto?				
			
		} 
		catch (ex) {
			console.log("waiting for more data chunks...");
		}
	});
}

GeoNames.prototype.receiveWeatherStations = function(response)
{
	var self = this;
	var body = "";
	response.on("data", function(data){		
		body += data;		
		try {			
			var stations = JSON.parse(body);			
			if (stations.weatherObservations.length > 0) {
				self.emit("weatherStationsFound", stations.weatherObservations);				
			}
			else {
				self.emit("weatherStationsNotFound");
			}
						
			self.removeAllListeners("weatherStationsFound"); //esto?
		} 
		catch (ex) {
			console.log("waiting for more data chunks...");
		}
	});
}


module.exports = GeoNames;