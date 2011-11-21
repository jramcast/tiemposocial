var Stations = function() {
	
};

Stations.currentStationId = '';
Stations.observationTimes = [];
Stations.numObs = 0;
//setInterval(Stations.updateTimes, 30000);


Stations.requestWUStations = function(lat, lng) {
	var url = "http://api.wunderground.com/api/4267d84ce31feded/geolookup/conditions/q/"+lat+","+lng+".json";
	$.ajax({
			url: url,
			dataType: "jsonp",
			success: function(parsed_json) {
				if(parsed_json['location']){
					
					var current_observation = parsed_json['current_observation'];
					Stations.showWeatherObservation(current_observation);
					
					//var nearbyStations = parsed_json['location']['nearby_weather_stations'];
					//Stations.showOtherWUStations(nearbyStations);
				}			
			}			
		});
}

Stations.showWeatherObservation = function(observation) {	
	$("#weather_observation").html(Stations.generateObservationHtml(observation))
	.css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
};

Stations.generateObservationHtml = function(observation) {
	var location = observation['observation_location'];
	var html = 		"<div class='col col_3 nohmargin'>" +					
					"		<div class='weather_obs_temperature'>" + observation['temp_c'] + "ºC</div>" + //ºC (sensación térmica: "+ observation['windchill_c']+" ºC)
					"</div>" +
					"<div class='col col_2'>" +
					"	<img src='"+ observation['icon_url'] + "'></img>" +
					"</div>" +
					"<div class='clear'></div>" +
					"<div class='weather_obs_conditions'>" + observation['weather'] + "</div>" +
					"<div class='weather_label'><strong>Punto de rocío: </strong>" +  observation['dewpoint_c'] + " ºC</div>" +
					"<div class='weather_label'><strong>Visibilidad: </strong>" + observation['visibility_km'] + " km</div>" +
					"<div class='weather_label'><strong> Humedad relativa: </strong>" + observation['relative_humidity'] + "</div>" +
					"<div class='weather_label><strong>Precipitación: </strong>" + observation['precip_1hr_in'] + "mm (hora). " + observation['precip_today_in'] + "(hoy)</div>" +
					"<div class='weather_label'><strong>Presión: </strong>" + observation['pressure_mb'] + "hPa " + Stations.tendencyString(observation['pressure_trend']) +" </div>" +
					"<div class='weather_label'><strong>Viento: </strong>" + observation['wind_string'] +" </div>" +
					"<div class='weather_label date'> <span id='#obs_date"+Stations.numObs+"'>" + TwitterDateFormater.since(observation['observation_time_rfc822']) + 
																"</span> en "+ location['city']	+" ("+ Stations.altitudeInM(location['elevation'])+") </div>";					

	Stations.addObservationTime(observation['observation_time_rfc822']);
	return html;
};




/*Stations.showOtherWUStations = function(nearbyStations) {
	var pws = nearbyStations['pws'].station;	
	for(var i in pws)
	{
		var station = pws[i];
		var neighborhood = (station['neighborhood']) ? station['neighborhood']+', ' : '';
		var html = '<li onclick="Stations.changeMainObservation(\''+ station['id'] +'\');">'+
		 			neighborhood + station['city'] +' (a '+station['distance_km']+' km)</li>';
		
		$("ul#other_stations").append(html).css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
	}	
	
};

Stations.changeMainObservation = function(id) {
	var url = "http://api.wunderground.com/api/4267d84ce31feded/conditions/q/pws:"+id+".json";
	$.ajax({
			url: url,
			dataType: "jsonp",
			success: function(parsed_json) {
				if(parsed_json['current_observation']){
					var current_observation = parsed_json['current_observation'];
					Stations.showWeatherObservation(current_observation);
				}			
			}			
		});	
	
};*/


Stations.addObservationTime = function(t) {
	Stations.observationTimes.push(t);
	Stations.numObs++;
};


Stations.tendencyString = function(t) {
	switch(t){
		case '-': 
			return ' y bajando';
			break;
	  	case '+':
			return 'y subiendo';
			break;
		case '0':
			return '';
			break;
		default:
			return '';
			
	}	
};


Stations.stationList = function(nearby_stations) {
	var pws = nearby_stations['pws']['station'];
	
	var html = '<ul>';
	
	for(var i in pws) {
		var station = pws[i];
		var link = 'http://api.wunderground.com/api/4267d84ce31feded/conditions/q/pws:'+ station['id'] +'.json';
		html += '<li><a href="'+link+'">Estacion: ' +station['city']+'. A'+ station['distance_km']+ 'kms de distancia</a></li>';
	}
	
	html += '</ul>';
	
	return html;
};

Stations.listen = function() {
	socket.on("weatherStationsFound", function(data) {		
		$("#weather_stations_list").html('');
		for(var i in data){
			var mainResult = data[i];						
			$("<li class='list_no_style'></li>").html("<div class='weather_station_name' onClick='Stations.showDetails(\"station_details_" + i + "\");'>" + mainResult.stationName + "</div>" + 
							"<ul class='weather_station_details' id='station_details_" + i + "'>" +
							"<li class='weather_obs_temperature list_no_style '>" + mainResult.temperature + "ºC</li>" +
							"<li class='weather_obs_conditions list_no_style'>" + mainResult.weatherCondition + " "+ mainResult.clouds +"</li>" +												
							"<li class='weather_station_humidity list_no_style'><strong>Humedad: </strong>" + mainResult.humidity + "%</li>" +							
							"<li class='weather_station_hecto list_no_style'><strong>Presión: </strong>" + mainResult.hectoPascAltimeter + "hPa</li>" +
							"<li class='weather_station_winds list_no_style'><strong>Viento: </strong>" + Stations.knotsToKmsH(mainResult.windSpeed) + "km/h " + mainResult.windDirection + "º</li>" +
							"<li class='weather_station_elevation list_no_style'><strong>Elevación: </strong>" + mainResult.elevation + " m</li>" +
							"<li class='weather_station_last_observation list_no_style date' id='#obs_date"+Stations.numObs+"'>" + TwitterDateFormater.since(mainResult.datetime) + "</li>" +	
							"</ul>")
			.prependTo("#weather_stations_list");
			Stations.addObservationTime(mainResult.datetime);
		}
		$("#weather_stations").show();		
	});
	
	socket.on("weatherStationsNotFound", function(data) {
		$("#weather_stations_list").html('');
		$("#weather_stations").hide();
	});
	
};

Stations.showDetails = function(stationId) {
	if(stationId)	{
		if(Stations.currentStationId == stationId)	{
			$('#'+stationId).slideUp("fast");
			Stations.currentStationId = '';
		}
		else {
			$('#'+Stations.currentStationId).slideUp("fast");
			$('#'+stationId).slideDown("fast");
			Stations.currentStationId = stationId;
		}
	}
	
	
};

Stations.altitudeInM = function(f) {
	if(f){
		var feet = parseInt((f.split(" ft"))[0]);
		var meters = parseInt(feet * 0.3048);
		return meters +" m";
	}
	else 
		return '';
	
	
};

Stations.knotsToKmsH = function(v) {
	return v * 1.852;
};

Stations.updateTimes = function() {
	for(var i in Stations.observationTimes) {
		$("#obs_date"+i).html(TwitterDateFormater.since(Stations.observationTimes[i]));
	}	
};

