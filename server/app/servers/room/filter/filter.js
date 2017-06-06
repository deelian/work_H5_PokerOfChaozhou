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
    return new Filter(app);
};

var Filter = function(app) {
    this.app = app;
};

Filter.prototype.before = function(msg, session, next) {
    next();
};

Filter.prototype.after = function(err, msg, session, resp, next) {
    next(err);
};
