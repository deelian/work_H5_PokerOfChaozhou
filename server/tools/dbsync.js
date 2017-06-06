#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander');
var async = require('async');
var GameDB = require('../../models/game');

/**
 * Commander implements.
 */
function parseDB(val) {
    if (val == "game") {
        return GameDB;
    }
}

function syncDB(db, table, init) {
    var iterator = function(name, callback) {
        var Model = db.models[name];

        Model.sync({ force: program.force }).then(function() {
            console.log("Model %s synced...", name);
            callback();
        }).catch(function(e) {
            console.log("Model %s sync failed", name, e);
            callback(e);
        })
    };

    var keys = [];
    if (table != null) {
        keys = [ table ];
    }
    else {
        keys = Object.keys(db.models);
    }

    async.eachSeries(keys, iterator, function(err) {
        if (err != null) {
            console.error("models init error", err);
            process.exit(-1);
        }

        console.log("models init success!");
        console.log(init);

        if (init) {
            console.log(init);
            db.models.user.create({
                account: "admin",
                password: "admin",
                data:     "{}"
            }).then(function(record) {
                if (record == null) {
                    console.log("insert users failed...");
                    process.exit(-1);
                }

                console.log("insert record to Model %j", record.toJSON());
                process.exit(0);
            }).catch(function(e) {
                console.log("system error", e);
                process.exit(-1);
            });
        } else {
            process.exit(0);
        }
    });
}

if (process.env.NODE_ENV == "production") {
    console.error("Don't do this in production environment!!!");
    process.exit(-1);
}

/**
 * Commander defines.
 */
program
    .version("0.0.1", null)
    .option("-d --database [db]", "database name", parseDB, null)
    .option("-t --table [tbl]", "table name", null, null)
    .option("-f --force", "force sync", null, null)
    .option("-i --init", "init tables", null, null)
    .parse(process.argv);

syncDB(program.database, program.table, program.init);
