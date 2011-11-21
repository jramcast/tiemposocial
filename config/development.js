/*Configuration paramaters for development environment*/
module.exports = function(app,express)
{
	app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	  process.env.APP_PORT = 3000;	  
	});
};