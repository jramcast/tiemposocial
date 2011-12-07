var server = 'http://' + location.host;
var socket = io.connect(server);
var neighbours = {};
var place = '';





window.onload = function(){		
	setListeners();
	runVisuals();
	searchPlace();	
	
	
}

var setListeners = function() {
	
	socket.on("connect",function() {
		$("#status").html("");		
	});
	
	socket.on('nearbyClients',function(nearby) {
		var html = '';
		neighbours = {};
		for(var i in nearby){
			if(neighbours[nearby[i]] && neighbours[nearby[i].name]) neighbours[nearby[i].name]++;
			else neighbours[nearby[i].name] = 1;				
		}
		
		for(var name in neighbours){
			if (neighbours[name] == 1)
				html += ', ' + name;
			else
				html += ', ' + name +' ('+neighbours[name]+')';					
		}	
		
		html = html.substring(1, html.length);		
		if(html){
			$("#nearby").html('Oye, parece que hay más gente mirando por <span>' + html + '.</span> Lo que publiques les llegará en directo. <strong>!Diles algo!</strong>');
		}		
		else {
			$("#nearby").html('');
		}	
	});
	
	socket.on("disconnect", function() {
		$("#status").html("Ups! Hubo un problema con la conexión al servidor. Recarga la página.");
	});	
	
	var publications = new Publications();
	publications.listen();	
	Places.listen();			
	Stations.listen();
};

var runVisuals = function() {
	Visuals.run();
};

var searchPlace = function() {
	Places.checkSearchedPlace();
}

var setLinks = function(text) {
	if(text){
		var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	  	return text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
	}
	return '';	
};

var showContent = function() {
	$('#twitter_stream_box').css({opacity:0}).slideDown('fast').animate({opacity:1},"fast"); //show
	$('#weather_box').css({opacity:0}).slideDown('fast').animate({opacity:1},"fast"); //show
};











