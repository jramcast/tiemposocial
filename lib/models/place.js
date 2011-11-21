var PlaceModel = require('../schemas/schema').PlaceModel;
var Entity = require('./entity');
var Common = require('../lib/common');


//Class Place
var Place = function(placeName) {

	this.modelClass = PlaceModel;
	this.initModel();
	
	
	this.getName = function() {
		return this.model.name; 
	}
	
	this.getLocation = function() {
		return this.model.location; 
	}
	
	this.getPublications = function() {		
		var publicationsList = [];
		for(var i = 0; i<this.model.publications.length; i++){
			publicationsList[i] = Publication.createWithModel(this.model.publications[i]);
		}
		return publicationsList;
	}
	
	this.setName = function(name)	{
		this.model.name = name;
	}
	
	
	this.setLocation = function (latitudeAndLongitude) {
		this.model.location = latitudeAndLongitude;
	};	
		
	this.addPublication = function(publication){
		this.model.publications.push(publication.getModel());	
	}		
	
	this.getLastPublication = function () {		
		var numberOfPublications = this.model.publications.length;
		if(numberOfPublications > 0)
		{
			publicationInModel = this.model.publications[numberOfPublications-1];
			return Publication.createWithModel(publicationInModel);
		}
		else 
			return false;
	}
};

Place.prototype = new Entity;
Place.prototype.constructor = Place;
//Place.prototype.__proto__ = DbEntity.prototype;
//con este las propiedades publicas no se heredan


Place.prototype.loadByName = function(pName, callbackToController) {
	this.prepareDbConnectionWithCallback(callbackToController);	
	var onLoad = Common.tools.bind(this._onLoad, this);		
	PlaceModel.findOne({ name: pName}, onLoad);
};


Place.prototype._onSave = function(err, place) {
	this.handleErrorIfExists(err);
	console.log('Place ' + place.name + ' saved');
	this.model = place;			
	this.callbackToControllerOnDatabaseOperationDone(this.model._id);	
}


Place.prototype._onLoad = function(err,place) {
	this.handleErrorIfExists(err);
			
	if(place) {	
		this.loadDbModel(place);
		console.log('Found: ' + this.model.name);
	}
	else {
		this.model = new PlaceModel();	
	}		
	this.callbackToControllerOnDatabaseOperationDone(this);		
};



Place.load = function(id, onload) {
	var place = new Place();
	place.loadById(id,onload);
};



/*module.exports.create =  function() {
	return new Place();
};

module.exports.createFromInputData =  function(inputData) {	
	var place = new Place();		
	place.setName(inputData.name);
	return place;	
};*/



module.exports =  Place;


