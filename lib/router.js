var PlaceRoutes = require('./controllers/routes/placeroutes');

var Router = function(app) {
	
	this.setRoutes = function() {	
		_setSiteIndexRoute();		
		PlaceRoutes.createRoutes(app, 'places');
	}		


	var _setSiteIndexRoute = function() {
		
		app.get('/', function(req, res){
		  	res.render('index', { title: 'Nuublo' , 
								scripts: ['javascripts/browserlocator.js',
											//'/javascripts/jquery.min.js',
											'/javascripts/index.js']}
					);
		});
	};		
};


module.exports.createRoutes = function(app){
	var router = new Router(app);
	router.setRoutes();
	return router;
}