var YandexMusicApi = require('yandex-music-api');

var api = new YandexMusicApi();

api.init({
        username: 'example@yandex.ru',
        password: 'password'
    })
    .then(function(token) {
        console.log('uid: ' + token.uid);
        console.log('token: ' + token.access_token);
        console.log('expires in: ' + new Date(new Date().getTime() + token.expires_in * 1000));
    })
    .catch(function(err) {
        console.log('Error: ', err);
    });