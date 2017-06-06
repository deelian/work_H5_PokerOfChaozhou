/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var debug = require('debug')('u-practice:controller:orders');
var GameDB = require('../../models/game');
var Model = GameDB.models.user;

/*
 * UModules Dependencies
 */
var Game = require('../../game/');
var GE = Game.ERROR;

module.exports = {
    name: "orders",

    list: function(req, res, next) {
        var body = {};
        var page = req.query.page || 1;
        var pageCount = req.query.page_count || 50;

        Model.findAndCountAll({
            where: { system: 0, agent: 0 },
            offset: (page - 1) * pageCount,
            limit: pageCount
        }).then(function(results) {
            var count = results.count;
            var records = results.rows;

            console.log(results);

            body.count      = count;
            body.total      = Math.ceil(count/pageCount);
            body.page       = page;
            body.pageCount  = pageCount;
            body.data       = [];

            records.forEach(function(record) {
                var data = record.toJSON();

                delete data.password;
                delete data.player;

                body.data.push(data);
            });

            res.success(body);
        }).catch(function(e) {
            next(e);
        });
    },

    get: function(req, res, next) {
        var id = req.params.id;

        Model.findOne({
            where: { id: id }
        }).then(function(record) {
            if (record == null) {
                res.error(GE.NOT_EXISTS);
                return;
            }

            var data = record.toJSON();

            delete data.password;

            res.success(data);
        }).catch(function(e) {
            next(e);
        });
    },

    create: function(req, res, next) {
        Model.create({

        }).then(function(record) {
            res.success(record);
        }).catch(function(e) {
            next(e);
        });
    },

    update: function(req, res, next) {
        var id = req.params.id;

        Model.update({

        }, {
            where: { id: id }
        }).then(function(results) {
            res.success();
        }).catch(function(e) {
            next(e);
        });
    },

    delete: function(req, res, next) {
        var id = req.params.id;

        Model.destroy({
            where: { id: id }
        }).then(function(results) {
            res.success();
        }).catch(function(e) {
            next(e);
        });
    }
};
