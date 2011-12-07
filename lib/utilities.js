module.exports.bind = function(fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  }
}

module.exports.stringContains = function(str, substr) { 
	if(substr.length == 0) return false;
	return str.indexOf(substr) != -1; 
}


module.exports.sortByDate = function(array) {
	array.sort(function(a,b) {
		aTime = Date.parse(a.timeStamp);
		bTime = Date.parse(b.timeStamp);
		return bTime-aTime});
	return array;
};

module.exports.simplifyString = function(string) {
	string = string.replace("á", "a");
	string = string.replace("é", "e");
	string = string.replace("í", "i");
	string = string.replace("ó", "o");
	string = string.replace("ú", "u");
	string = string.toLowerCase();
	
	return string;	
};

