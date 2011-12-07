var EventEmitter = require('events').EventEmitter,
	TwitterFeeder = require('./twitterfeeder'),
	TwitterSearcher = require("./twittersearcher"),
	GeoNames = require('./geonames'),
	Publication = require('./models/publicationmodel'),
	Common = require('./common'),
	Tools = Common.tools;

var Client = function(twitterStream) {
	this.twitterStream = twitterStream;
	this.nearbyClients = [];
};

Client.prototype = Object.create(EventEmitter.prototype);

Client.prototype.checkPlace = function(placeName){	
	var self = this;	
	
	this.geoNames = new GeoNames();
	this.geoNames	
	.on('placesFound', function(places) {
		self.startPlaceServices(places);
	})
			
	.on('placeNotFound', function() {
		self.emit('placeNotFoundInGeoNames');
	})	
		
	.search(placeName);
}

Client.prototype.startPlaceServices = function(places){		
	this.places = places;
	this.emit('placeCheckedInGeoNames', places);	
	var mainResult =  places[0];		
	this.searchWeatherStations(mainResult);	
	this.searchPrevious(mainResult.name , mainResult.lat, mainResult.lng);			
	this.startTwitterStream(mainResult.name, mainResult.lat, mainResult.lng);
}


Client.prototype.searchWeatherStations = function(place){
	var self = this;
			
	this.geoNames
	.on('weatherStationsFound', function(stations) {
		self.emit('weatherStationsFound', stations);
	})

	.on('weatherStationsNotFound', function() {
		self.emit('weatherStationsNotFound');
	})
	
	.searchWeatherStations(place.lat, place.lng);	   
}

Client.prototype.searchPrevious = function(placeName, lat, lng){		
	this.previousPublications = [];
	this.requiredPreviousMethods = 0;
	
	var self = this;
	var twitterSearcher = new TwitterSearcher();	
	
	twitterSearcher.on("tweets", function(tweets){			
		self.checkAllPreviousResultsReady(tweets);	
	});
		
	twitterSearcher.search(placeName, lat, lng);	
	
	Publication.recent(function(recent) {		
		var filtered = self.filterNearbyPublications(recent, lat, lng);	
		
		var weatherFiltered = [];
		for(var i in filtered){
			for(var j in Common.twitterStreamKeywords){				
				var text = Tools.simplifyString(filtered[i].text);				
				if( Tools.stringContains(text, Common.twitterStreamKeywords[j]) ){
					weatherFiltered.push(filtered[i]);
					break;
				}
			}
		}	
			
		self.checkAllPreviousResultsReady(weatherFiltered);
		
	})	   
}



Client.prototype.checkAllPreviousResultsReady = function(previous) {
	this.requiredPreviousMethods++;
	
	if(typeof previous == 'object')	{ //is array
		for(var i in previous){
			this.previousPublications.push(previous[i]);
		}
	}
	//TODO: set timeout por si no aparecen tweets
	if(this.requiredPreviousMethods == 2){		
		this.emit('previousTweetsFound', Tools.sortByDate(this.previousPublications));
		
	}
};

Client.prototype.filterNearbyPublications = function(publications, lat, lng) {
	var nearby = [];
	var self = this;
	publications.forEach(function(pub) {
		if(self.isInsideCoordinatesBox(pub, lat, lng)){
			pub.text = unescape(pub.text);
			nearby.push(pub);
		}
	});
	return nearby;
}
Client.prototype.isInsideCoordinatesBox = function(pub, lat, lng) {
	if(pub.location)
	{
		var clientLat = pub.location.lat;
		var clientLng = pub.location.lng;
		var r = 1; //margin in degrees
		return (clientLat >= lat-r && clientLat <= lat+r && clientLng >= lng-r && clientLng <= lng+r);
	}
	else return false;	
};


Client.prototype.startTwitterStream = function(placeName, lat, lng){		
	var self = this;
	this.twitterFeeder = new TwitterFeeder(this.twitterStream);	
	this.twitterFeeder.on("tweet", function(tweet){		
        self.emit('liveTweetFound', tweet);
	});			
	this.twitterFeeder.search(placeName, lat, lng);
};


Client.prototype.changePlace = function(whichPlace) {       
	if(this.twitterFeeder) {
		this.twitterFeeder.endStream();
	}
	var placeIndex = whichPlace.placeIndex;	
	this.places = this.reorderPlaces(placeIndex);
	this.startPlaceServices(this.places);
}


Client.prototype.reorderPlaces = function(placeIndex) {
	//mejorar esto por dios!
	var reorderedResults = [];
	reorderedResults[0] = this.places[placeIndex];		
	for(var i in this.places){
		if(i != placeIndex){
			reorderedResults.push(this.places[i]);	
		}		
	}
	return reorderedResults;
};

Client.prototype.sendPublicationToNearbyClients = function(publication) {
	var publication = this.setPublicationLocation(publication);
	if(this.nearbyClients)	{
		for(var i in this.nearbyClients)
			this.nearbyClients[i].emit('publicationNearby', publication);	
	}
};


Client.prototype.savePublication = function(publication) {
	var p = this.setPublicationLocation(publication);
	new Publication(p).save();
};

Client.prototype.setPublicationLocation = function(publication) {
	publication.location = {};
	publication.location.name = this.mainPlace().name;
	publication.location.lat = this.mainPlace().lat;
	publication.location.lng = this.mainPlace().lng;	
	return publication;
};

Client.prototype.disconnect = function() {
	
	this.removeListeners();
		
	if(this.twitterFeeder) {			
		this.twitterFeeder.endStream();
		console.log('client disconnecting');
	}
	else{
		console.log('could not remove feeder listener from client ');
	}
}

Client.prototype.mainPlace = function() {
	return this.places[0];
};

Client.prototype.hasMainPlace = function() {
	var places = this.places;
	if(!places) 
		return false;
	
	var place = places[0];
	if(!place)
		return false;
	
	return place.lat && place.lng && place.name;
};


Client.prototype.setNearbyClients = function(clients) {
	this.nearbyClients = clients;
	this.emit('nearbyClients', this.getPlacesFromNearbyClients());			

};

Client.prototype.newNearbyClient = function(client) {
	this.nearbyClients.push(client);
	this.emit('nearbyClients', this.getPlacesFromNearbyClients());
};


Client.prototype.nearbyClientLeft = function(client) {
	var i = this.nearbyClients.indexOf(client); 
 	if(i!=-1) this.nearbyClients.splice(i, 1);
	
	this.emit('nearbyClients', this.getPlacesFromNearbyClients());	
};

Client.prototype.getPlacesFromNearbyClients = function(){
	var places = [];
	for(var i in this.nearbyClients){
		if(this.nearbyClients[i].hasMainPlace())
			places.push(this.nearbyClients[i].mainPlace());
	}
	return places;
}

Client.prototype.removeListeners = function() {	
	var events = ['placeCheckedInGeoNames','placeNotFoundInGeoNames', 'weatherStationsFound', 'weatherStationsNotFound'
	,'previousTweetsFound', 'liveTweetFound', 'nearbyClients' ];
	
	for(var i in events)
	{
		this.removeAllListeners(events[i]);
	}
};


module.exports = Client;