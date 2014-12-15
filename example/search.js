var YandexMusicApi = require('../lib/yandex-music-api'),
    config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
    .then(function() {

        var query = 'gorillaz',
            options = { type: 'artist' }

        return api.search(query, options).then(function(result) {
            console.log('Search result for artists "' + query + '" (page: ' + result.page + ', per page: ' + result.perPage + '):');
            result.artists.results.forEach(function(artist) {
                console.log(artist.name);
            })
        });
    })
    .then(function() {
        var query = 'gorillaz',
            options = { type: 'album' }

        return api.search(query, options).then(function(result) {
            console.log('\nSearch result for albums "' + query + '" (page: ' + result.page + ', per page: ' + result.perPage + '):');
            result.albums.results.forEach(function(album) {
                console.log(album.title + ' - ' + album.artists[0].name);
            })
        });
    })
    .then(function() {
        var query = 'cristmas',
            options = { type: 'track' }

        return api.search(query, options).then(function(result) {
            console.log('\nSearch result for tracks: "' + query + '" (page: ' + result.page + ', per page: ' + result.perPage + '):');
            result.tracks.results.forEach(function(track) {
                console.log(track.title + ' - ' + track.artists[0].name);
            })
        });
    })
    .catch(function(err) {
        console.log('Error: ', err);
    });