var TwitterFeederClientsManager = function() {
	this.clients = {}; //connected clients	
};

TwitterFeederClientsManager.prototype.addClient = function(feeder, socket){
	this.clients[socket.id] = feeder;	
};

TwitterFeederClientsManager.prototype.getClient = function(id){
	return this.clients[id];
};

module.exports = TwitterFeederClientsManager;