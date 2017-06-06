/**
 * Module dependencies.
 */

/*
 * Server Dependencies
 */

/*
 * Game Modules Dependencies
 */


module.exports = {
    formatURL: function(uri, params) {
        var url = uri.length ? uri + '?' : "";

        var keys = Object.keys(params);
        keys.forEach(function(key) {
            url += key + '=' + encodeURIComponent(params[key]) + '&';
        });

        url = url.substring(0, url.length - 1);

        return url;
    }

};
