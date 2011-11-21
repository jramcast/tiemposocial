var PlaceController = require('../placecontroller');
var EntityRoutes = require('./entityroutes');



var PlaceRoutes = function(app, root) {
	EntityRoutes.call(this, app, root); //super constructor
	this.controller = new PlaceController(app);
};

PlaceRoutes.prototype = Object.create(EntityRoutes.prototype);


PlaceRoutes.prototype.setRoutes = function() {	
	EntityRoutes.prototype.setRoutes.call(this);
	this._search();
}

EntityRoutes.prototype._search = function() {
	var controller = this.controller;	
	this.app.post(this._searchPath(),function (req, res) {
		controller.actionSearch(req.body.place.search_string,res);
	});
	
	var controller = this.controller;	
	this.app.get(this._searchPath() + '/:name',function (req, res) {
		controller.actionSearch(req.params.name,res);
	});		
}

EntityRoutes.prototype._searchPath = function() {
	return '/' + this.rootWord + '/search';
};


PlaceRoutes.createRoutes = function(app, rootWord) {
	new PlaceRoutes(app,rootWord).setRoutes();
};
	
	
module.exports = PlaceRoutes;