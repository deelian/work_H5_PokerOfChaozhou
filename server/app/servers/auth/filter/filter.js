/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var pomelo = require('../../../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

/*
 * Game Dependencies
 */
var Game = require('../../../../../game');

module.exports = function(app) {
    return new Filter();
};

var Filter = function() {
};

// Filter.prototype.before = function(msg, session, next) {
//
// };
//
// Filter.prototype.after = function(msg, session, next) {
//
// };
