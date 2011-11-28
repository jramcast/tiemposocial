var PlaceController = function(app) {
	this.socketManager = app.socketManager;	
};


PlaceController.prototype.actionSearch = function(placeName, response) {	
	response.render('place/show',
	{		
		title:  process.env.APP_NAME + ' | Buscar ' + placeName, 
		locals: { 	place: placeName,    
					scripts: [	'/socket.io/socket.io.js', 
							  	'/javascripts/jquery.min.js',
								'/javascripts/dateformater.js',
								'/javascripts/tweets.js',
								'/javascripts/visuals.js',
								'/javascripts/places.js',
								'/javascripts/stations.js',
							  	'/javascripts/place.js' ]
				}
	});	
};

module.exports = PlaceController;