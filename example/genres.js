var YandexMusicApi = require('../lib/yandex-music-api'),
    config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
    .then(function() {
        return api.getGenres().then(function(genres) {
            console.log('Music genres:')

            genres.forEach(function(genre) {
                console.log(genre.titles.en.title + ' (tracks: ' + genre.tracksCount + ')');
            })
        });
    })
    .catch(function(err) {
        console.log('Error: ', err);
    });