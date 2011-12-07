var Client = require('./client');

var ClientFactory = function(twitterStream) {
	this.clients = []; //connected clients	
	this.twitterStream = twitterStream;
};

ClientFactory.prototype.create = function(){
	var client = new Client(this.twitterStream);
	this.addNew(client);
	return client;
};

ClientFactory.prototype.discard = function(client){
	client.disconnect();
	for(var i in this.clients){
		this.clients[i].nearbyClientLeft(client);
	}
	this.remove(client);
};

ClientFactory.prototype.remove = function(client) {
	var i = this.clients.indexOf(client); 
 	if(i!=-1) this.clients.splice(i, 1);
};


ClientFactory.prototype.addNew = function(client){
	var self = this;
	client.on('placeCheckedInGeoNames', function(places) {
		self.calculateNeighborhood(client);				
	});
	this.clients.push(client);
};

ClientFactory.prototype.calculateNeighborhood = function(client) {	
	var nearby = this.searchNearbyClients(client);
	for (var i in nearby){		
		//console.log('SITIO CERCANO!!!!!!!!!!!');
		nearby[i].newNearbyClient(client);				
	}
	client.setNearbyClients(nearby);	
};



ClientFactory.prototype.searchNearbyClients = function(client){
		
	var place = client.mainPlace();	
	if(place.lat === undefined) return [];
	if(place.lng === undefined) return [];	
	
	var lat = place.lat;
	var lng = place.lng;	
	
	
	var nearby = [];
	for(var i in this.clients){				
		if(this.isClientInsideCoordinatesBox(this.clients[i], lat, lng)){
			nearby.push(this.clients[i]);
		}	
	}
	return this.deleteFromArray(nearby,client);
};

ClientFactory.prototype.isClientInsideCoordinatesBox = function(client, lat, lng) {
	if(!client.hasMainPlace()) 
		return false;
	
	var place = client.mainPlace();
	var clientLat = place.lat;
	var clientLng = place.lng;	
	
	var r = 1; //margin in degrees
	return (clientLat >= lat-r && clientLat <= lat+r && clientLng >= lng-r && clientLng <= lng+r);
};

ClientFactory.prototype.deleteFromArray = function(nearby, client) {
	var i = nearby.indexOf(client); 
 	if(i!=-1) nearby.splice(i, 1);
	return nearby;
};




module.exports = ClientFactory;