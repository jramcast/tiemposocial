var Common = require('./common'),
	Tools = Common.tools;
		

var SocketsManager = function(app) {
	this.twitterNode = app.twitterNode;
	this.io = require('socket.io').listen(app);	
	var onConnection = Tools.bind(this.onConnection, this);
	this.io.sockets.on('connection', onConnection);	
	this.clientFactory = app.clientFactory;
};


SocketsManager.prototype.onConnection = function(socket) { //Para cada conexión		
	var self = this;
	var client = this.clientFactory.create();
	
	socket.on('place', function (place) {		
		client
		.on('placeCheckedInGeoNames', function(places) {
			socket.emit('placeCheckedInGeoNames', places);
		})

		.on('placeNotFoundInGeoNames', function() {
			socket.emit('placeNotFoundInGeoNames');
		})	

		.on('weatherStationsFound', function(stations) {
			socket.emit('weatherStationsFound', stations);
		})

		.on('weatherStationsNotFound', function() {
			socket.emit('weatherStationsNotFound');
		})
		
		.on("previousTweetsFound", function(tweets){
	        socket.emit('previousTweetsFound', tweets);
		})
		
		.on("liveTweetFound", function(tweet){
	        socket.emit('liveTweetFound', tweet);
		})
		
		.on("nearbyClients", function(places) {		
			socket.emit('nearbyClients', places);			
		})
		
		.on('publicationNearby', function(publication) {
			socket.emit('publicationNearby', publication);
		})
		
		.checkPlace(place.name);	   
	});
	
	socket.on('want_another_place', function(whichPlace) {			
		client
		.on('weatherStationsFound', function(stations) {
			socket.emit('weatherStationsFound', stations);
		})

		.on('weatherStationsNotFound', function() {
			socket.emit('weatherStationsNotFound');
		})
		.changePlace(whichPlace);	
	});
	
	socket.on('publication', function(message){			
		var publication = {user: 'Alguien en Nuublo', text: message.data, timeStamp: new Date()};
		client.sendPublicationToNearbyClients(publication);
		client.savePublication(publication);
			
    });
	
	socket.on('disconnect', function() {		
		self.clientFactory.discard(client);		
	});
};


module.exports.createWithAppReference =  function(app) {
	var socketManager = new  SocketsManager(app);
	return socketManager;
};
