var restler = require('restler');

function Rest() {

    /* *******************************************
     * P R I V A T E
     * *******************************************/

    function _sendRequest(method, uri, options, callback) {

        method(uri, options)
            .on('success', function(data, response) {
                if (data.result) {
                    callback(null, data.result);
                } else {
                    callback(null, data);
                }
            })
            .on('fail', function(err, response) {
                if (err) {
                    callback(err);
                } else {
                    callback(new Error('Request failed'));
                }
            })
            .on('error', function(err, response) {
                if (err) {
                    callback(err);
                } else {
                    callback(new Error('Request error'));
                }
            })
            .on('timeout', function(ms) {
                callback(new Error('Request timed out (' + ms + ')'));
            });
    }

    /* *******************************************
     * M E T H O D S
     * *******************************************/

    this.get = function(request, callback) {
        
        _sendRequest(restler.get, request.getURI(), {
            query: request.getQuery(),
            headers: request.getHeaders(),
            data: request.getBodyData()
        }, callback);
    }

    this.post = function(request, callback) {

        _sendRequest(restler.post, request.getURI(), {
            query: request.getQuery(),
            headers: request.getHeaders(),
            data: request.getBodyData()
        }, callback);
    }
}

module.exports = new Rest();