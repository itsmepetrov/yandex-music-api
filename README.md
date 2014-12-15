Yandex.Music API (Unofficial) for Node
====

This is a Node.js wrapper for the [Yandex.Music](http://music.yandex.ru/) API that is used in mobile apps (iOS/Android).

Installation
-------

    npm install yandex-music-api

Usage
-------
```js
var api = new YandexMusicApi();
api.init({username: 'example@yandex.ru', password: 'password'}).then(function() {
	// place code here
})
```

This library provides following functions:

#### Users
- getAccountStatus
- getFeed

#### Music
- getGenres
- search

#### Playlist
- getUserPlaylists
- getPlaylist
- getPlaylists
- createPlaylist
- removePlaylist
- renamePlaylist
- addTracksToPlaylist
- removeTracksFromPlaylist