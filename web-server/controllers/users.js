/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var debug = require('debug')('u-practice:controller:users');
var GameDB = require('../../models/game');
var User = GameDB.models.user;
var sequelize = GameDB.sequelize;
var ServerError = require('../errors/server-error');

/*
 * UModules Dependencies
 */
var Game = require('../../game/');
var GE = Game.ERROR;

module.exports = {
    name: "users",

    list: function(req, res, next) {
        var body = {};
        var page = req.query.page || 1;
        var pageCount = parseInt(req.query.page_count) || 5;
        var offset = (page - 1) * pageCount;

        User.findAndCountAll({
            offset: offset,
            limit: pageCount
        }).then(function(results) {
            var count = results.count;
            var records = results.rows;


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

        User.findOne({
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
        User.create({

        }).then(function(record) {
            res.success(record);
        }).catch(function(e) {
            next(e);
        });
    },

    update: function(req, res, next) {
        var id = req.params.id;

        User.update({

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

        User.destroy({
            where: { id: id }
        }).then(function(results) {
            res.success();
        }).catch(function(e) {
            next(e);
        });
    },

    rechargeTokens: function (req, res, next) {
        /*
        * 需要获取代理的id、玩家的id
        * 分别通过代理的id和玩家的id查找自己拥有的tokens
        * 如果代理拥有的tokens小于充值的tokens，响应充值的钻石数量大于代理拥有的钻石数量
        * 否则，执行下面的操作
        *   代理id拥有的tokens减掉替玩家id充值的tokens
        *   玩家id拥有的tokens加上充值的tokens
        *   代理id和玩家id分别更新最终的tokens
        * */
        var user           = req.user;
        var playerID       = req.params.id;
        var rechargeTokens = parseInt(req.body.tokens) || 0;

        return sequelize.transaction(function (t) {

            return User.findOne(

                {
                    where: { id: user.id }
                },

                {
                    transaction: t
                }

            ).then(function (record) {

                    if (record == null) {
                        throw new ServerError(GE.NOT_EXISTS);
                    }

                    if(record.tokens < rechargeTokens){
                        return res.error(403, 'RangeError', '充值的钻石数量大于代理拥有的钻石数量');
                    }

                    record.tokens -= rechargeTokens;

                    return record.save();
                }
            ).then(function () {

               return User.findOne(
                    // conditions
                    {
                        where: { id: playerID }
                    },

                    // options
                    {
                        transaction: t
                    }
                ).then(function (record) {
                    if (record == null) {
                        throw new ServerError(GE.NOT_EXISTS);
                    }

                    record.tokens += rechargeTokens;

                    return record.save();
                });
            });

        }).then(function (result) {
            res.success();
        }).catch(function (err) {
            next(err);
        });
    }
};
