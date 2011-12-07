var mongoose  = require('mongoose'),
	Schema = mongoose.Schema,	
	EventEmitter = require('events').EventEmitter;


var PublicationSchema = new Schema({	
	text: String,
	user: String, //cambiar esto a objectID
	location: {name: String, lat: Number, lng: Number},
	timeStamp: Date
});

PublicationSchema.static('recent', function(callback) {
	var oneDay = 1000 * 60 * 60 *24;
	this.find({timeStamp: {$gte: Date.now() - (oneDay * 2) }}, callback)
});

var PublicationModel = mongoose.model('Publication', PublicationSchema);



var Publication = function(parameters) {
	if(parameters.text.length > 500) 
		this.text = parameters.text.substring(0,500);
	else 
		this.text = parameters.text;
		
	this.text = escape(this.text);
	this.user = parameters.user;
	this.location = parameters.location;
	this.timeStamp = parameters.timeStamp;
};

Publication.prototype = Object.create(EventEmitter.prototype);

Publication.prototype.save = function() {	
	mongoose.connect('mongodb://localhost/nuublo');
	var publication = new PublicationModel();
	publication.text = this.text;
	publication.user = this.user;
	publication.location = this.location;
	publication.timeStamp = this.timeStamp;
	
	var self = this;
	publication.save(function(err) {
		if (err) { throw err; }
		self.emit('saved');
		mongoose.disconnect();
	});
};


Publication.recent = function(callback) {
	mongoose.connect('mongodb://localhost/nuublo');
	PublicationModel.recent(function(err, recent) {
		if (err) { throw err; }
		callback(recent);
		mongoose.disconnect();
	})
};

module.exports = Publication;

	





