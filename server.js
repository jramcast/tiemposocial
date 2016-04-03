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
/* Initialize Twitter API */
/*var config = {	
	action: "filter", 
	track: Common.twitterStreamKeywords,
	user: "#######",
	password: "########"
};*/

var config = {
  consumer_key: 'MNOYxcNXehdG2KbU5epzGoDTf',
  consumer_secret: 't4j6qJ4Pd7aMfs2afN32AWVgatCH6kdvxHh3m9itAud4ziHLML',
  access_token_key: '52827928-qR2y5T4F2MeExz6Pc0wbI4H4TqTHDVHoSUBUU5FyV',
  access_token_secret: 'raiXTSFuoSIgc8OwTrxBe8RkPlftIarFfpuf4oWWQBNgV'
};
var twitterAPI  = new Twitter(config);

/*Initialize Client Factory*/
var clientFactory = new ClientFactory(twitterAPI);
module.exports.clientFactory = clientFactory;


/*Initialize Socket.IO*/
var socketManager = SocketsManager.createWithAppReference(app);
/////////////////////////////////////////////////////



/* Set Routes */
Router.createRoutes(app);

/*catch any exception*/
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

//Start Server App
if(!module.parent) {
	console.log('listening on: ' + process.env.APP_PORT);
	app.listen(process.env.APP_PORT);
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}


