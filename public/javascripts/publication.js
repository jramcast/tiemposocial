var Publication = function(data, id) {
	this.text = data.text
	this.user = data.user;
	this.id	  = id;
	this.timeStamp = data.timeStamp;
	this.location = (data.location) ? data.location : "";
	this.cssClass = "";
};

Publication.prototype.html = function(data) {
	
	var text = setLinks(this.text);	
	var location = '';
	if(this.location){
		if(this.location.name) location = this.location.name;
		else location = this.location;
	}
	
	var user = this.user;
	if(this.cssClass == "tweet")
		user = '@' + user;
	
	var html = 	"<div class='" + this.cssClass + " publication'><div class='publication_text'>" + text + "</div>";
	html += 	"<div class='row'>";
	html += 	"	<div class='col col_4'><div class='publication_user'>" + user + "</div></div>";	
	html +=		"	<div class='col col_5'><div id='publication_date"+this.id+"' class='publication_date'>" + TwitterDateFormater.since(this.timeStamp) + "</div></div>";
	html +=		"	<div class='clear'></div>";
	html += 	"</div>";
	html +=		(location) ? "<div class='publication_location'> Cerca de " + location + "</div>" : "";
	html += "</div>";
	return html;
	
};

var Tweet = function(tweet, id) {
	Publication.call(this,tweet,id);
	this.cssClass = "tweet";
};
Tweet.prototype = Object.create(Publication.prototype);


var UserPublication = function(tweet, id) {
	Publication.call(this,tweet,id);
	this.cssClass = "user_publication";
};
UserPublication.prototype = Object.create(Publication.prototype);

