var Config = function(app,express) {	
	require('./general.js')(app, express);
	require('./development.js')(app, express);
	require('./production.js')(app, express);
};


//export pseudo class
module.exports = Config;