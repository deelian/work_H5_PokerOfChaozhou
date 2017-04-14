var fs = require('fs');
var logger = require('pomelo-logger');

/**
 * Configure pomelo logger
 */
module.exports.configure = function(app, filename) {
    var serverId = app.getServerId();
    var base = app.getBase();
    var config = JSON.parse(fs.readFileSync(filename, "utf8"));

    config.appenders.forEach(function(appender) {
        appender.layout = {
            type: "pattern",
            pattern: "%[[%d] [%x{sid}] [%p] %c -%] %m%n",
            tokens: {
                sid: function() {
                    return serverId;
                }
            }
        };
    });

    logger.configure(config, {serverId: serverId, base: base});
};
