var AuthRequest = require('./auth-request'),
    ApiRequest = require('./api-request'),
    Promise = require('promise'),
    rest = require('./rest');

function YandexMusicApi() {

    /* *******************************************
     * C O N F I G
     * *******************************************/

    var _config = {

        ouath_code: {
            CLIENT_ID: '0618394846eb4d9589a602f80ce013d6',
            CLIENT_SECRET: 'c13b3de8d9f5492caf321467c3520358',
        },

        oauth_token: {
            CLIENT_ID: '23cabbbdc6cd418abb4b39c32c41195d',
            CLIENT_SECRET: '53bc75238f0c4d08a118e51fe9203300',
        },

        fake_device: {
            DEVICE_ID: '377c5ae26b09fccd72deae0a95425559',
            UUID: '3cfccdaf75dcf98b917a54afe50447ba',
            PACKAGE_NAME: 'ru.yandex.music'
        },

        user: {
            USERNAME: null,
            PASSWORD: null,
            TOKEN: null,
            UID: null
        },
    }

    /* *******************************************
     * P R I V A T E
     * *******************************************/

    function _performRequest(method, request)
    {
        var promise = new Promise(function(resolve, reject) {

            method(request, function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        return promise;
    }

    function _getAuthHeader()
    {
        return { 'Authorization' : 'OAuth ' + _config.user.TOKEN };
    }

    /* *******************************************
     * P U B L I C
     * *******************************************/

    /**
     * Authentication:
     * Step one: Get an authorization code.
     * Step two: Exchange code to receive an access_token for the user.
     * @returns {Promise}
     */

    this.init = function(config)
    {
        // Skip authorization if access_token and uid are present
        if (config.access_token && config.uid) {
            _config.user.TOKEN = config.access_token;
            _config.user.UID = config.uid;
            return Promise.resolve({
              'access_token': config.access_token,
              'uid': config.uid
            });
        }

        _config.user.USERNAME = config.username;
        _config.user.PASSWORD = config.password;

        // Authorization: step one
        var request = AuthRequest.get()
            .setPath('/1/token')
            .setBodyData({
                'grant_type': 'password',
                'username': _config.user.USERNAME,
                'password': _config.user.PASSWORD,
                'client_id': _config.ouath_code.CLIENT_ID,
                'client_secret': _config.ouath_code.CLIENT_SECRET
            });

        return _performRequest(rest.post, request).then(function(data) {

              // Authorization: step two
            var request = AuthRequest.get()
                .setPath('/1/token')
                .setQuery({
                  'device_id': _config.fake_device.DEVICE_ID,
                  'uuid': _config.fake_device.UUID,
                  'package_name': _config.fake_device.PACKAGE_NAME
                })
                .setBodyData({
                  'grant_type': 'x-token',
                  'access_token': data.access_token,
                  'client_id': _config.oauth_token.CLIENT_ID,
                  'client_secret': _config.oauth_token.CLIENT_SECRET
                })

            return _performRequest(rest.post, request).then(function(token) {
                // Store user token and uid for other requests
                _config.user.TOKEN = token.access_token;
                _config.user.UID = token.uid;

                token.expires_on = new Date(new Date().getTime() + token.expires_in * 1000);

                return token
            });
        });
    }

    /* *******************************************
     * E N D P O I N T S
     * *******************************************/

    /**
     * GET: /account/status
     * Get account status for curren user
     * @returns {Promise}
     */
    this.getAccountStatus = function() {

        var request = ApiRequest.get()
            .setPath('/account/status')
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /feed
     * Get the user's feed
     * @returns {Promise}
     */
    this.getFeed = function() {

        var request = ApiRequest.get()
            .setPath('/feed')
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /genres
     * Get a list of music genres
     * @returns {Promise}
     */
    this.getGenres = function() {

        var request = ApiRequest.get()
            .setPath('/genres')
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /search
     * Search artists, tracks, albums.
     * @param   {String} query     The search query.
     * @param   {Object} [options] Options: type {String} (artist|album|track|all),
                                            page {Int},
                                            nococrrect {Boolean}
     * @returns {Promise}
     */
    this.search = function(query, options) {

        var opts = options || {};

        var request = ApiRequest.get()
            .setPath('/search')
            .addHeaders(_getAuthHeader())
            .setQuery({
                'type': opts['type'] || 'all',
                'text': query,
                'page': opts['page'] || 0,
                'nococrrect': opts['nococrrect'] || false
            });

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /users/[user_id]/playlists/list
     * Get a user's playlists.
     * @param   {String} userId The user ID, if null then equal to current user id
     * @returns {Promise}
     */
    this.getUserPlaylists = function(userId) {

        var request = ApiRequest.get()
            .setPath('/users/' + (userId || _config.user.UID) + '/playlists/list')
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /users/[user_id]/playlists/[playlist_kind]
     * Get a playlist without tracks
     * @param   {String} userId       The user ID, if null then equal to current user id
     * @param   {String} playlistKind The playlist ID.
     * @returns {Promise}
     */
    this.getPlaylist = function(userId, playlistKind) {

        var request = ApiRequest.get()
            .setPath('/users/' + (userId || _config.user.UID) + '/playlists/' + playlistKind)
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.get, request);
    }

    /**
     * GET: /users/[user_id]/playlists
     * Get an array of playlists with tracks
     * @param   {String} userId       The user ID, if null then equal to current user id
     * @param   {String} playlistKind The playlist ID.
     * @param   {Object} [options]    Options: mixed {Boolean}, rich-tracks {Boolean}
     * @returns {Promise}
     */
    this.getPlaylists = function(userId, playlists, options) {

        var opts = options || {};

        var request = ApiRequest.get()
            .setPath('/users/' + (userId || _config.user.UID) + '/playlists')
            .addHeaders(_getAuthHeader())
            .setQuery({
                'kinds': playlists.join(),
                'mixed': opts['mixed'] || false,
                'rich-tracks': opts['rich-tracks'] || false
            });

        return _performRequest(rest.get, request);

    }

    /**
     * POST: /users/[user_id]/playlists/create
     * Create a new playlist
     * @param   {String} name      The name of the playlist
     * @param   {Object} [options] Options: visibility {String} (public|private)
     * @returns {Promise}
     */
    this.createPlaylist = function(name, options) {

        var opts = options || {};

        var request = ApiRequest.get()
            .setPath('/users/' + _config.user.UID + '/playlists/create')
            .addHeaders(_getAuthHeader())
            .setBodyData({
                'title': name,
                'visibility': opts.visibility || 'private'
            });

        return _performRequest(rest.post, request);
    }

    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/delete
     * Remove a playlist
     * @param   {String} userId       The user ID, if null then equal to current user id
     * @param   {String} playlistKind The playlist ID.
     * @returns {Promise}
     */
    this.removePlaylist = function(playlistKind) {

        var request = ApiRequest.get()
            .setPath('/users/' + _config.user.UID + '/playlists/' + playlistKind + '/delete')
            .addHeaders(_getAuthHeader());

        return _performRequest(rest.post, request);
    }

    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/name
     * Change playlist name
     * @param   {String} playlistKind The playlist ID.
     * @param   {String} name         New playlist name.
     * @returns {Promise}
     */
    this.renamePlaylist = function(playlistKind, name) {

        var request = ApiRequest.get()
            .setPath('/users/' + _config.user.UID + '/playlists/' + playlistKind + '/name')
            .addHeaders(_getAuthHeader())
            .setBodyData({'value': name});

        return _performRequest(rest.post, request);
    }

    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Add tracks to the playlist
     * @param   {String}   playlistKind The playlist's ID.
     * @param   {Object[]} tracks       An array of objects containing a track info:
                                        track id and album id for the track.
                                        Example: [{id:'20599729', albumId:'2347459'}]
     * @param   {String}   revision     Operation id for that request
     * @param   {Object}   [options]    Options: at {Int}
     * @returns {Promise}
     */
    this.addTracksToPlaylist = function(playlistKind, tracks, revision, options) {

        var opts = options || {};

        var request = ApiRequest.get()
            .setPath('/users/' + _config.user.UID + '/playlists/' + playlistKind + '/change-relative')
            .addHeaders(_getAuthHeader())
            .setBodyData({
                'diff': JSON.stringify([{
                    'op': 'insert',
                    'at': opts.at || 0,
                    'tracks': tracks
                }]),
                'revision': revision
            });

        return _performRequest(rest.post, request);
    }

    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Remove tracks from the playlist
     * @param   {String}   playlistKind The playlist's ID.
     * @param   {Object[]} tracks       An array of objects containing a track info:
                                        track id and album id for the track.
                                        Example: [{id:'20599729', albumId:'2347459'}]
     * @param   {String}   revision     Operation id for that request
     * @param   {Object}   [options]    Options: from {Int},
                                                 to {Int}
     * @returns {Promise}
     */

    this.removeTracksFromPlaylist = function(playlistKind, tracks, revision, options) {

        var opts = options || {};

        var request = ApiRequest.get()
            .setPath('/users/' + _config.user.UID + '/playlists/' + playlistKind + '/change-relative')
            .addHeaders(_getAuthHeader())
            .setBodyData({
                'diff': JSON.stringify([{
                    'op': 'delete',
                    'from': opts['from'] || 0,
                    'to': opts['to'] || tracks.length,
                    'tracks': tracks
                }]),
                'revision': revision
            });

        return _performRequest(rest.post, request);
    }
}

module.exports = YandexMusicApi;
