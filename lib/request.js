function Request(config) {

	this.scheme = config.scheme;
	this.host   = config.host;
	this.port   = config.port;
	this.path   = config.path;

	this.headers  = config.headers;
	this.query    = config.query;
	this.bodyData = config.bodyData;
}

Request.prototype.setPath = function(path) {

	this.path = path;

	return this;
}

Request.prototype.getHeaders = function(headers) {

	return this.headers;
}

Request.prototype.setHeaders = function(headers) {

	this.headers = headers;

	return this;
}

Request.prototype.addHeaders = function(headers) {

	if (!this.headers) {
    	this.headers = headers;
	} else {
	    for (var key in headers) {
	    	this.headers[key] = headers[key];
	    }
	}

	return this;
}

Request.prototype.getQuery = function() {

	return this.query;
}

Request.prototype.setQuery = function(query) {

	this.query = query;

	return this;
}

Request.prototype.addQuery = function(query) {

	if (!this.query) {
    	this.query = query;
	} else {
	    for (var key in query) {
	    	this.query[key] = query[key];
	    }
	}

	return this;
}

Request.prototype.getQueryAsString = function() {

	if (!this.query) return '';

	var params = [];

	for (var key in this.query) {

		params.push(key + '=' + this.query[key]);
  	}

  	return '?' + params.join('&');
}

Request.prototype.getBodyData= function() {

	return this.bodyData;
}

Request.prototype.setBodyData = function(bodyData) {

	this.bodyData = bodyData;

	return this;
}

Request.prototype.addBodyData = function(bodyData) {

	if (!this.bodyData) {
    	this.bodyData = bodyData;
	} else {
	    for (var key in bodyData) {
	    	this.bodyData[key] = bodyData[key];
	    }
	}

	return this;
}

Request.prototype.getURI = function() {

	var uri = this.scheme + '://' + this.host;

	if (this.port) {
    	uri += ':' + this.port;
  	}

  	if (this.path) {
  		uri += this.path;
  	}

  	return uri;
}

Request.prototype.getURL = function() {

	var url = this.getURI() + this.getQueryAsString();

	return url;
};

module.exports = Request;