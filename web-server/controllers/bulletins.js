/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var debug = require('debug')('u-practice:controller:bulletins');
var GameDB = require('../../models/game');
var Bulletin = GameDB.models.bulletin;

/*
 * UModules Dependencies
 */
var Game = require('../../game/');
var GE = Game.ERROR;

module.exports = {
    name: "bulletins",

    list: function(req, res, next) {
        var body = {};
        var page = parseInt(req.query.page) || 1;
        var pageCount = parseInt(req.query.page_count) || 50;

        Bulletin.findAndCountAll({
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
                body.data.push(record.toJSON());
            });

            res.success(body);
        }).catch(function(e) {
            next(e);
        });
    },

    get: function(req, res, next) {
        var id = req.params.id;

        Bulletin.findOne({
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
        var bulletin = req.body.bulletin;

        Bulletin.create({
            title: bulletin.title,
            summary: bulletin.summary,
            content: bulletin.content,
            startTime: bulletin.startTime,
            endTime: bulletin.endTime,
            priority: bulletin.priority
        }).then(function(result) {
            res.success(result);
        }).catch(function(e) {
            next(e);
        });
    },

    update: function(req, res, next) {
        var id = req.params.id;
        var bulletinCheck = req.body.bulletin;

        Bulletin.update({
            title: bulletinCheck.title,
            summary: bulletinCheck.summary,
            content: bulletinCheck.content,
            startTime: bulletinCheck.startTime,
            endTime: bulletinCheck.endTime,
            priority: bulletinCheck.priority
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

        Bulletin.destroy({
            where: { id: id }
        }).then(function(results) {
            res.success();
        }).catch(function(e) {
            next(e);
        });
    }
};
