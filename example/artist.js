var YandexMusicApi = require('../lib/yandex-music-api'),
    config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
    .then(() => {
        const query = 'Sufjan Stevens';
        const options = {type: 'artist'};

        return api.search(query, options);
    })
    .then((result) => {
        id = result.artists.results[0].id;
        return api.getArtist(id);
    })
    .then((result) => {
        console.log(JSON.stringify(result));
    })
    .catch((err) => {
        console.log('Error: ', err);
    });