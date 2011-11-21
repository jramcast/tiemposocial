var GeoNames = require('./geonames'),
	TwitterFeeder = require('./twitterfeeder'),
	TwitterSearcher = require('./twittersearcher'),
	Common = require('./common'),
	Tools = Common.tools;
	
	

var SocketsManager = function(app) {
	this.app = app;
	this.io = require('socket.io').listen(app);	
	var onConnection = Tools.bind(this.onConnection, this);
	this.io.sockets.on('connection', onConnection);	
	this.clients = {}; //connected clients
	
};


SocketsManager.prototype.onConnection = function(socket) { //Para cada conexión		
	var self = this;
	socket.on('place', function (place) {
			self.checkPlace(place.name, socket);
	   
	});
	
	socket.on('want_another_place', function(whichPlace) {
		
		var placeIndex = whichPlace.placeIndex;
		socket.get('placeResults', function (err, places) {
		    if (err){
				console.log('Error retreiving places from socket ', name);
			}  
			
			//acabar el stream anterior que tiene la ciudad antigua
			var feeder = self.clients[socket.id];		
			if(feeder) {
				feeder.endStream();
			}
			
			
			//mejorar esto por dios!
			var reorderedResults = [];
			reorderedResults[0] = places[placeIndex];		
			for(var i in places){
				if(i != placeIndex){
					reorderedResults.push(places[i]);	
				}		
			}

			socket.emit('placeCheckedInGeoNames', reorderedResults);
			var mainResult =  reorderedResults[0];
			new GeoNames()
			.on('weatherStationsFound', function(stations) {
				socket.emit('weatherStationsFound', stations);
			})

			.on('weatherStationsNotFound', function() {
				socket.emit('weatherStationsNotFound');
			})
			.searchWeatherStations(mainResult.lat, mainResult.lng);
			self.searchTwitter(mainResult.name, socket , mainResult.lat, mainResult.lng);
			self.startTwitterStream(mainResult.name, socket, mainResult.lat, mainResult.lng);
			
		});
		
		
		
		
	});
	
	socket.on('disconnect', function() {
		console.log('client disconnecting : ' + socket.id);
		var feeder = self.clients[socket.id];		
		if(feeder) {
			feeder.endStream();
		}
		else{
			console.log('could not remove feeder listener from client ' + socket.id);
		}
		
	});
};


SocketsManager.prototype.checkPlace = function(placeName, socket){	
	var geoNames = new GeoNames();
	
	var self = this;
	
	geoNames
	
	.on('placesFound', function(places) {
		socket.set('placeResults', places);
		socket.emit('placeCheckedInGeoNames', places);
		var mainResult =  places[0];
		geoNames.searchWeatherStations(mainResult.lat, mainResult.lng);
		self.searchTwitter(mainResult.name, socket , mainResult.lat, mainResult.lng);
		self.startTwitterStream(mainResult.name, socket, mainResult.lat, mainResult.lng);
		
	})
			
	.on('placeNotFound', function() {
		socket.emit('placeNotFoundInGeoNames');
	})	
	
	.on('weatherStationsFound', function(stations) {
		socket.emit('weatherStationsFound', stations);
	})
	
	.on('weatherStationsNotFound', function() {
		socket.emit('weatherStationsNotFound');
	})
	
	.search(placeName);
}


SocketsManager.prototype.searchTwitter = function(placeName, socket, lat, lng){		
	var self = this;
	var twitterSearcher = new TwitterSearcher();
	
	twitterSearcher.on("tweets", function(tweets){
        socket.emit('previousTweetsFound', tweets);
	});
	
	twitterSearcher.search(placeName, lat, lng);
	//twitterSearcher.searchByLocation(lat, lng);
	//twitterSearcher.searchByName(placeName);	   
}


SocketsManager.prototype.startTwitterStream = function(placeName, socket, lat, lng){	

	var twitterFeeder = new TwitterFeeder(this.app.twitterNode);
	this.addClient(twitterFeeder, socket);
		
	twitterFeeder.on("tweet", function(tweet){
        socket.emit('liveTweetFound', tweet);
	});		
	twitterFeeder.searchByName(placeName, lat, lng);
};

SocketsManager.prototype.addClient = function(feeder, socket){
	this.clients[socket.id] = feeder;	
};


module.exports.createWithAppReference =  function(app) {
	var socketManager = new  SocketsManager(app);
	return socketManager;
};
