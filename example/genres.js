var YandexMusicApi = require('../lib/yandex-music-api'),
    config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
    .then(function() {
        return api.getGenres().then(function(genres) {
            console.log('Music genres:')

            genres.forEach(function(genre) {
                var genreTitle = 'Unknown';
                if(genre.titles.en){
                    genreTitle = genre.titles.en.title;
                }else if(genre.titles.ru){
                    genreTitle = genre.titles.ru.title;
                }
                console.log(genreTitle + ' (tracks: ' + genre.tracksCount + ')');

                if(genre.subGenres){
                    genre.subGenres.forEach(function(subGenre){
                        var genreTitle = 'Unknown';
                        if(subGenre.titles.en){
                            genreTitle = subGenre.titles.en.title;
                        }else if(subGenre.titles.ru){
                            genreTitle = subGenre.titles.ru.title;
                        }
                        console.log('    >' + genreTitle + ' (tracks: ' + subGenre.tracksCount + ')');
                    })
                }
                
            })
        });
    })
    .catch(function(err) {
        console.log('Error: ', err);
    });