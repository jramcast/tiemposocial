/* Dependencies */
var express = require('express');
var app = module.exports = express.createServer();
var Router = require('./lib/router.js');
var SocketsManager = require('./lib/socketsmanager');
var TwitterNode = require("twitter-node").TwitterNode;
var Common = require('./lib/common');

// Configuration
require('./config/config.js')(app, express);

/*Initialize Socket.IO*/
var socketManager = SocketsManager.createWithAppReference(app);

/*Initialize Twitter Stream*/
var config = {	
	action: "filter", 
	track: Common.twitterStreamKeywords,
	user: "itknowingness",
	password: "kfu73pKeID"
};

var twitterNode  = new TwitterNode(config);

module.exports.socketManager = socketManager;
module.exports.twitterNode = twitterNode;

/* Set Routes */
Router.createRoutes(app);

/*catch any exception*/
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

//Start Server App
if(!module.parent) {
	app.listen(80);//process.env.APP_PORT);
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}


