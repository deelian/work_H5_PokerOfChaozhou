/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

/*
 * Game Dependencies
 */


module.exports = function(app, opts) {
    return new Component(app, opts);
};

var Component = function(app, opts) {
    opts = opts || {};

    this.app = app;
    this.service = opts.service || app.get('roomService');
};

Component.prototype.name = '__room__';

Component.prototype.start = function(cb)
{
    this.service.loadRooms(function(done) {
        process.nextTick(cb);
    });
};

Component.prototype.afterStart = function(cb)
{
    process.nextTick(cb);
};

Component.prototype.stop = function(force, cb)
{
    process.nextTick(cb);
};
