var Request = require('./request');

var HOST = 'api.music.yandex.net',
    HANDLER_HOST = 'music.yandex.ru',
    PORT = 443,
    SCHEME = 'https';

module.exports.get =  function() {
    return new Request({
        host: HOST,
        port: PORT,
        scheme: SCHEME
    });
}

module.exports.getHandler = function() {
    return new Request({
        host: HANDLER_HOST,
        port: PORT,
        scheme: SCHEME
    });
}
