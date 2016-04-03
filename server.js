/* Dependencies */
var express = require('express');
var app = module.exports = express.createServer();
var Router = require('./lib/router.js');
var SocketsManager = require('./lib/socketsmanager');
var Twitter = require("twitter");
var Common = require('./lib/common');
var ClientFactory = require('./lib/clientfactory');

// Configuration
require('./config/config.js')(app, express);

////////// SINGLETONS ///////////////////////////////////////////

var config = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

/* Initialize Twitter API */
var twitterAPI  = new Twitter(config);

/* Initialize Client Factory */
var clientFactory = new ClientFactory(twitterAPI);
module.exports.clientFactory = clientFactory;


/* Initialize Socket.IO */
var socketManager = SocketsManager.createWithAppReference(app);
/////////////////////////////////////////////////////



/* Set Routes */
Router.createRoutes(app);

/* catch any exception */
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

//Start Server App
if(!module.parent) {
	console.log('listening on: ' + process.env.APP_PORT);
	app.listen(process.env.APP_PORT);
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}


