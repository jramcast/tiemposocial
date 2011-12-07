var Publications = function() {
	this.publicationTimes = [];
	this.publications = 0;
};

Publications.prototype.listen = function() {
	
	this.initTwitterFeedListener();
	this.initTwitterSearchListener();
	this.initUserPublications();
	var self = this;
	setInterval(function() {
		return self.updatePublicationTimes.call(self);
	}, 30000);
};


Publications.prototype.initTwitterFeedListener = function() {
	var self = this;
	socket.on('liveTweetFound', function(tweet) {
		if($('#waiting_message')) $('#waiting_message').remove();
		self.showTweet(tweet);
    });
}  

Publications.prototype.initTwitterSearchListener = function() {
	var self = this;
	socket.on('previousTweetsFound', function(data) {
		if($('#waiting_message')) $('#waiting_message').remove();
		reverseI = data.length - 1;
		for(var i in data){
			var tweet = data[reverseI - i];
			if(tweet.type == "tweet")
				self.showTweet(tweet);
			else
				self.showUserPublication(tweet);
		}
	});
};

Publications.prototype.initUserPublications = function() {
	var self = this;
	socket.on('publicationNearby',function(publication){
		if($('#waiting_message')) $('#waiting_message').remove();
	    self.showUserPublication(publication);
	});	
	this.initInputBox();	
};


Publications.prototype.showTweet = function(tweet) {
	var tweetHtml = this.generateTweetHtml(tweet);
	$("<li></li>").html(tweetHtml).prependTo("ul#publications").css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
	this.addTimeStamp(tweet.timeStamp);
};

Publications.prototype.showUserPublication = function(publication) {
	data = {
		text : publication.text,
		user : publication.user,
		timeStamp: publication.timeStamp,
		location: publication.location,
	};
	var html = this.generateUserPublicationHtml(data);
	$("<li></li>").html(html).prependTo("ul#publications").css({opacity:0}).slideDown("slow").animate({opacity:1},"fast");
	this.addTimeStamp(data.timeStamp);
};

Publications.prototype.generateTweetHtml = function(tweet) {	
	return new Tweet(tweet,this.publications).html();
};
Publications.prototype.generateUserPublicationHtml = function(publication) {	
	return new UserPublication(publication,this.publications).html();
};

Publications.prototype.initInputBox = function() {	
	var self = this;
    $('#user_publication_button').click(function() {
		self.publish();
	});
	$('#publicationInputBox').keydown(function(event) {
		if(event.keyCode == 13){
			self.publish();
		}
	});
};



Publications.prototype.addTimeStamp = function(t) {
	this.publications++;
	this.publicationTimes.push(t);
};

Publications.prototype.updatePublicationTimes = function() {
	for(var i in this.publicationTimes) {
		$("#publication_date"+i).html(TwitterDateFormater.since(this.publicationTimes[i]));
	}	
};

Publications.prototype.publish = function(){
    var mensaje = document.getElementById("publicationInputBox").value;
	mensaje = $.trim(mensaje);
	if(mensaje)
	{
    	document.getElementById("publicationInputBox").value = ""; // Vaciar caja de texto
    	var publicationBox = document.createElement("div");
    	publicationBox.innerHTML = mensaje;
    	this.showUserPublication({text: mensaje, user: 'Tú', timeStamp: new Date(), location: ''});
		socket.emit('publication', { data: mensaje, location: place });
	}
};


