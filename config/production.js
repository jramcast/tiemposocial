/*Configuration paramaters for production environment*/
module.exports = function(app,express)
{
	app.configure('production', function(){
	  app.use(express.errorHandler()); 
	  process.env.APP_PORT = 12648;
	});
}