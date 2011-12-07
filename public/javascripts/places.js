var Places = function() {};

Places.checkSearchedPlace = function() {	
	socket.emit('place', { name: $("#search_string").html()});
}


Places.listen = function() {
	socket.on('placeCheckedInGeoNames', function(data) {	
			Places.showPlaceName(data[0]);
			Places.setAlternativeResults(data);
			showContent();						
	});	  
	    	
	socket.on("placeNotFoundInGeoNames", function() {
		$("#place_info").html('Sin resultados :(');
	});	
};

Places.showPlaceName = function(p) {
	place = p.name;
	$("#place_info").html(p.name + ', ' + p.adminName1 + ', ' + p.countryName);
	Stations.requestWUStations(p.lat, p.lng);
};

Places.setAlternativeResults = function(data) {
	if(data.length > 1)
	{
		$("#other_results").css({display:'block'});
		$("#other_results ul").html('');
		for(var i in data){
			if(i!=0){
				var place = data[i];
				var placeName = place.name + ', ' + place.adminName1 + ', ' + place.countryName;
				$("<li onclick='Places.requestOtherPlace("+ i +");'></li>").html(placeName).appendTo("#other_results ul");
			}								
		}
	}
};

Places.requestOtherPlace = function(i) {	
	socket.emit('want_another_place', { placeIndex: i});
	
};

Places.showOtherResults = function() {
		
		var otherResults = $("#other_results ul");
		if(otherResults.is(":hidden"))	{
			otherResults.slideDown("fast");
		}
		else {
			otherResults.slideUp("fast");
		}
		//	$("#other_results ul").css({opacity:0}).slideDown('fast').animate({opacity:1},"fast");
};


