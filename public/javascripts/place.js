var server = 'http://' + location.host;
var socket = io.connect(server);


window.onload = function(){		
	setListeners();
	runVisuals();
	searchPlace();	
}

var setListeners = function() {
	
	socket.on("connect",function() {
		$("#status").html("En directo");
	});
	
	socket.on("disconnect", function() {
		$("#status").html("Desconectado");
	});
	
	
	
	var tweets = new Tweets();
	tweets.listen();	
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
	var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  	return text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');	
};

var showContent = function() {
	$('#twitter_stream_box').css({opacity:0}).slideDown('fast').animate({opacity:1},"fast"); //show
	$('#weather_box').css({opacity:0}).slideDown('fast').animate({opacity:1},"fast"); //show
};











