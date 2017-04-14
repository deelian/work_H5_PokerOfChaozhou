
var fs = require('fs');
var path = require('path');
var env = process.env.NODE_ENV || "development";
var config = require('../config/db.game.json')[env];
var Sequelize = require('sequelize');

config.options.timezone = '+08:00';
config.options.logging = console.log;
var sequelize = new Sequelize(config.db, config.user, config.password, config.options);

var db = {
    sequelize: sequelize,
    Sequelize: Sequelize,
    models: {}
};

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    }).forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db.models[model.name] = model;
    });

// Object.keys(db).forEach(function(modelName) {
//     if ("associate" in db[modelName]) {
//         db[modelName].associate(db);
//     }
// });

db.getModel = function(name) {
    return this.models[name];
};

module.exports = db;