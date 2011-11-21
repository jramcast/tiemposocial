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
	
	var self = this;
	var baseUri = "http://where.yahooapis.com/v1/places.q";
	var coordinates = "('" + latitude + "," + longitude + "')?";
	var options = "format=json&lang=es&";
	var appId = "appid=wR9ADuzV34E1W3mPBYz_3bTOkB1LWR3f_8Cj.eNl4PRzmDQAJ5kBuu.H.FeCZfx6ObJ9XiVKsxaR_njfIyeSqVuFjOfBViA";
	var requestUri = baseUri + coordinates + options + appId;
	
	$.get(requestUri, function(data){
		var place = data.places.place[0];
		var msj = 'O echa un vistazo al tiempo en ' + self.generatePlaceLink(place);
	 	$("#your_location").html(msj);
	
	
		//Neighbours
		/*var baseUri = "http://where.yahooapis.com/v1/place/";
		var woeid = place.woeid +'/neighbors?';
		var requestUri = baseUri + woeid  + options + appId;
		$.get(requestUri, function(data){
			$("#your_location").append('<p>Or maybe in in :</p>' );		
			for(i in data.places.place)
			{
				place = data.places.place[i];			
				var woeid = place.woeid +'?';
				var requestUri = baseUri + woeid + options + appId;
				$.get(requestUri, function(data){
					place = data.place;
				 	$("#your_location").append('<p>' + place.locality2 + " " + place.locality1 + '</p>' );				
				});			
			}	
		});*/
	
	});

};

BrowserLocator.prototype.generatePlaceLink = function(place)
{
	var placeName = place.locality1;
	return "<a href='places/search/" + placeName + "'>" + place.locality2 + " " + place.locality1 + ", " + place.country + "</a>";
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
