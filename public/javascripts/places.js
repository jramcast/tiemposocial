var Places = function() {};

Places.checkSearchedPlace = function() {	
	socket.emit('place', { name: $("#search_string").html()});
}


Places.listen = function() {
	socket.on('placeCheckedInGeoNames', function(data) {	
			Places.showPlaceName(data[0]);
			Places.showAlternativeResults(data);
			showContent();						
	});	  
	    	
	socket.on("placeNotFoundInGeoNames", function() {
		$("#place_info").html('Sin resultados :(');
	});	
};

Places.showPlaceName = function(p) {
	$("#place_info").html(p.name + ', ' + p.adminName1 + ', ' + p.countryName);
	Stations.requestWUStations(p.lat, p.lng);
};

Places.showAlternativeResults = function(data) {
	if(data.length > 1)
	{
		$("#other_results").css({display:'block'});
		$("#other_results ul").html('');
		for(var i in data){
			if(i!=0){
				var place = data[i];
				var placeName = place.name + ', ' + place.adminName1 + ', ' + place.countryName;
				$("<li onclick='requestOtherPlace("+ i +");'></li>").html(placeName).appendTo("#other_results ul");
			}								
		}
	}
};