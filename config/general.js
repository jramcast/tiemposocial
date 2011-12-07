/*General configuration paramaters*/
module.exports = function(app,express)
{
	var MemStore = require('connect').session.MemoryStore;
		
	app.configure(function(){
		app.set('views', __dirname + '/../views');
		app.set('view engine', 'jade');
		app.set('db', 'jade');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser()); 
		app.use(express.session({ store: new MemStore({ reapInterval: 60000 * 10 }) , secret:"blablabla"}));
		app.use(app.router);
		app.use(express.static(__dirname + '/../public'));		
		process.env.APP_NAME = 'Nuublo';
		
	});
	
	app.dynamicHelpers (
	{
		session: function(req, res)
		{
			return req.session;
		},
		
		flash: function(req, res){
			return req.flash();
		}
	});
}