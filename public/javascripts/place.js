var server = 'http://ec2-176-34-198-192.eu-west-1.compute.amazonaws.com';
// 'http://192.168.1.35:3000';
var socket = io.connect(server);

window.onload = function(){	
	
	//var message = 'Esta aplicación está en fase de pruebas y es posible que tenga comportamientos erróneos o inesperados. Os agradeceríamos cualquier tipo de sugerencia, comentario o información sobre algún error que podáis experimentar ¡Muchas gracias!'
	
	showMenuBar();
	//$.jGrowl(message, { sticky: true, header:' En pruebas!'});
	var tweets = new Tweets();
	tweets.listen();	
	Places.listen();
	Places.checkSearchedPlace();		
	Stations.listen();	
	animateWaitMessage();	
	setTimeout(showInfoMessage, 2000);
	setTimeout(hideInfoMessage, 60000);	
}

var showMenuBar = function() {
	$('.menubar').show();
};

var showContent = function() {
	$('#twitter_stream_box').show();
	$('#weather_box').show();
};

var animateWaitMessage = function() {
	var intervalMs = 300;
    var interval = setInterval("iterateDots()", intervalMs);
}; 


function iterateDots(){
	var dotsStr = $('.dots').html();
	if(dotsStr != null)
	{
	    var dotsLen = dotsStr.length;
	    var maxDots = 3;
	    var dots = (dotsLen < maxDots * 2 ? dotsStr + ' .' : '');
		$('.dots').html(dots);
	}
}


var setLinks = function(text)
{
	var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  	return text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');	
};


var showInfoMessage = function() {
	$("#app_info").css({opacity:0}).slideDown('slow').animate({opacity:0.7},"slow");
};


var hideInfoMessage = function() {
	$("#app_info").css({opacity:0.7}).animate({opacity:0},"slow").slideUp('slow');
};


var showOtherResults = function() {
		
		var otherResults = $("#other_results ul");
		if(otherResults.is(":hidden"))	{
			otherResults.slideDown("fast");
		}
		else {
			otherResults.slideUp("fast");
		}
		//	$("#other_results ul").css({opacity:0}).slideDown('fast').animate({opacity:1},"fast");
	};
	




var requestOtherPlace = function(i) {	
	socket.emit('want_another_place', { placeIndex: i});
	
};









