var TwitterDateFormater = function() {
	
};

TwitterDateFormater.since = function(date)
{
	//Twitter los trae asi en search: 		Thu, 10 Nov 2011 21:04:06 +0000	
	//Twitter los trae asi en streaming: 	Mon Nov 14 15:10:04 +0000 2011
	var parsedDate = Date.parse(date);
	var currentTime = new Date().getTime();
	var minutes = (currentTime - parsedDate) / (60 * 1000);
	var sinceString = TwitterDateFormater.generateSinceString(minutes);	
	if(sinceString) 
		return sinceString;
	else 
		return date;
};


TwitterDateFormater.generateSinceString = function(minutes)
{
	if(minutes < 1)
		return 'Ahora mismo';
	else if (minutes <= 60){ //menos de una hora
		var unityString = (parseInt(minutes) == 1) ? ' minuto' : ' minutos';
		return 'Hace ' + parseInt(minutes) + unityString;
	}
	else if (minutes <= 60 * 24){ //menos de un dia
		var hours = parseInt(minutes/60);		
		var unityString = (hours == 1 ) ? ' hora' : ' horas';
			return 'Hace ' + hours + unityString;		
	}
	else if (minutes < 60 * 24 * 2){ //ayer
			return 'Ayer';		
	}
	else return false;
}