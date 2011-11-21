module.exports.bind = function(fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  }
}

module.exports.stringContains = function(str, substr) { 
	if(substr.length == 0) return false;
	return str.indexOf(substr) != -1; 
}
