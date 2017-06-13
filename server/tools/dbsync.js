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

    if (table != null) {
        var Model = db.models[table];

        Model.sync({ force: program.force }).then(function() {
            console.log("Model %s synced...", table);
            callback();
        }).catch(function(e) {
            console.log("Model %s sync failed", table, e);
            callback(e);
        })
    }
    else {
        db.sequelize.sync({ force: program.force }).then(function () {
            console.log("Database synced...")
        }).catch(function (e) {
            console.log("Database sync failed...", e);
        })
    }

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
    }
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
