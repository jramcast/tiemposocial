var BrowserLocator = function() {
	
};


BrowserLocator.prototype.locate = function()
{
	var me = this;	
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position) {		
			me._showPlace(position.coords.latitude, position.coords.longitude);
		});
	}		
};


BrowserLocator.prototype._showPlace = function(latitude, longitude) {
	//http://api.geonames.org/findNearbyPlaceNameJSON?lat=47.3&lng=9&username=jramcast
	
	var self = this;
	var baseUri = "http://api.geonames.org/findNearbyPlaceNameJSON";
	var coordinates = "lat=" + latitude + "&lng=" + longitude;
	var username = "username=jramcast";
	var options = "lang=es"
	var requestUri = baseUri + '?'+ coordinates + '&' + username + '&' + options;
	
	$.get(requestUri, function(data){
		var place = data.geonames[0];
		if(place.name){
			var msj = 'O echa un vistazo al tiempo en ' + self.generatePlaceLink(place);
		 	$("#your_location").html(msj);
		}		
	}, 'json');

};

BrowserLocator.prototype.generatePlaceLink = function(place)
{
	var searchTerm = place.name;
	var comma = '';
	if(place.countryName)
	{
		searchTerm += '%20' + place.countryName;
		comma = ', '
	}
	return "<a href='places/search/" + searchTerm + "'>" + place.name + comma + place.countryName + "</a>";
}




BrowserLocator.prototype.setMap = function(){
	var myOptions = {
      zoom: 8,
      center: this.googleMapsCoords,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	marker = new google.maps.Marker({
	                position: this.googleMapsCoords,
	                map: map,
	                title: "You are here"
	            });
};
