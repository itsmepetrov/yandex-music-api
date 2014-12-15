var Request = require('./request');

var HOST = 'oauth.mobile.yandex.net',
	PORT = 443,
	SCHEME = 'https';

module.exports.get =  function() {
	return new Request({
		host: HOST,
		port: PORT,
		scheme: SCHEME
	});
}