var Visuals = function() {
	
};

Visuals.run = function() {
	Visuals.showMenuBar();
	Visuals.animateWaitMessage();	
	setTimeout(Visuals.showInfoMessage, 2000);
	setTimeout(Visuals.hideInfoMessage, 60000);	
};

Visuals.showMenuBar = function() {
	$('.menubar').show();
};

Visuals.animateWaitMessage = function() {
	var intervalMs = 300;
    var interval = setInterval("Visuals.iterateDots()", intervalMs);
};

Visuals.showInfoMessage = function() {
	$("#app_info").css({opacity:0}).slideDown('slow').animate({opacity:0.7},"slow");
};

Visuals.hideInfoMessage = function() {
	$("#app_info").css({opacity:0.7}).animate({opacity:0},"slow").slideUp('slow');
};

Visuals.iterateDots = function(){
	var dotsStr = $('.dots').html();
	if(dotsStr != null)
	{
	    var dotsLen = dotsStr.length;
	    var maxDots = 3;
	    var dots = (dotsLen < maxDots * 2 ? dotsStr + ' .' : '');
		$('.dots').html(dots);
	}
}
