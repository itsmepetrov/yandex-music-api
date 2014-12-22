var YandexMusicApi = require('../lib/yandex-music-api'),
            config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
    .then(function(token) {
        console.log('uid: ' + token.uid);
        console.log('token: ' + token.access_token);
        console.log('expires in: ' + new Date(new Date().getTime() + token.expires_in * 1000));
    })
    .catch(function(err) {
        console.log('Error: ', err);
    });