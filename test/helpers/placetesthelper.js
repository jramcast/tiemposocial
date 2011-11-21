var PlaceFactory = require('../../models/placefactory.js');
var PlaceTestHelper = function() {};

PlaceTestHelper.generateTestPlace = function (){	
	return PlaceFactory.create(
		{
			name:'TEST PLACE '+ Math.random(),
			location: {latitude: 2.34, longitude: 3.52},
		});
}

PlaceTestHelper.generateEmpty = function (){	
	return PlaceFactory.createEmpty();
}


module.exports = PlaceTestHelper;	
