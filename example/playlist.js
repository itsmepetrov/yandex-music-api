var YandexMusicApi = require('../lib/yandex-music-api'),
	config = require('./config');

var api = new YandexMusicApi();

api.init(config.user)
	.then(function() {

		var name = 'Test Playlist',
			options = { 'visibility': 'public' };

		return api.createPlaylist(name, options).then(function(playlist) {

			console.log('New playlist has been created:')
			console.log('Name: ' + playlist.title);
			console.log('Kind: ' + playlist.kind);
			console.log('Visibility: ' + playlist.visibility);

			return playlist;
		});

	})
	.then(function(playlist) {

		var tracks = [
			{ id:'20599729', albumId:'2347459' },
			{ id:'20069589', albumId:'2265364' },
			{ id:'15924630', albumId:'1795812' },
		]

		return api.addTracksToPlaylist(playlist.kind, tracks, playlist.revision).then(function(playlist) {

			console.log('Added ' + playlist.trackCount + ' tracks to the playlist:');

			return playlist;
		});
	})
	.then(function(playlist) {

		var options = { 'rich-tracks': true }

		return api.getPlaylists(null, [playlist.kind], options).then(function(playlist) {

			playlist[0].tracks.forEach(function(item) {
				console.log(item.track.title + ' - ' + item.track.artists[0].name);
			});

			return playlist[0]
		});
	})
	.then(function(playlist) {

		var tracks = [
			{ id:'20599729', albumId:'2347459' },
			{ id:'20069589', albumId:'2265364' },
			{ id:'15924630', albumId:'1795812' },
		]

		return api.removeTracksFromPlaylist(playlist.kind, tracks, playlist.revision).then(function(playlist) {
			console.log('All added tracks removed from the playlist.')
			return playlist;
		});
	})
	.then(function(playlist) {

		return api.removePlaylist(playlist.kind).then(function(playlist) {
			console.log('The playlist has been deleted.')
		})
	})
	.catch(function(err) {
		console.log(err);
	});