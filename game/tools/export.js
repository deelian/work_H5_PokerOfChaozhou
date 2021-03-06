var fs = require('fs');
var path = require('path');

var files = [];
var excludeFiles = [
    "index.js",
    "Gruntfile.js",
    "node_modules/",
    "dist",
    "tools"
];

var prioritys = [];
prioritys.push({path:"libs/", p:0});
prioritys.push({path:"base/boot.js",p:1});
prioritys.push({path:"base/events.js", p:2});
prioritys.push({path:"base/serialize.js", p:3});
prioritys.push({path:"base/entity.js", p:4});
prioritys.push({path:"consts/", p:5});
prioritys.push({path:"utils/utils.js",p:6});
prioritys.push({path:"utils/random.js",p:7});
prioritys.push({path:"entities/player.js",p:8});
prioritys.push({path:"entities/poker.js", p:9});
prioritys.push({path:"entities/deck.js", p:10});
prioritys.push({path:"entities/staticGamble.js", p:21});
prioritys.push({path:"entities/customizedGamble.js", p:22});
prioritys.push({path:"entities/table.js", p:100});
prioritys.push({path:"entities/room.js", p:101});

// prioritys.push({path:"entities/stage.js", p:999});
// prioritys.push({path:"entities/player.js", p:1000});
// prioritys.push({path:"entities/playerHandle.js", p:1001});

var fileHandler = function(name){
    var file = name;

    file = file.replace(/\\/g,"/");
    if (!/\.js$/.test(file)) {
        return;
    }

    for (var i in excludeFiles) {
        if (file.indexOf(excludeFiles[i]) != -1) {
            return;
        }
    }

    files.push(file.substr(3));
};

var readDirectory = function(dir, handler) {
    fs.readdirSync(dir).forEach(function(file) {
        var name = dir + path.sep + file;
        var stat = fs.lstatSync(name);

        if (stat.isDirectory() == true) {
            readDirectory(name, handler);
        }
        else {
            handler(name);
        }
    });
};

var sortFunc = function(a,b) {
    var aPriority = 100;
    var bPriority = 100;
    for(var i in prioritys){
        if(a.indexOf(prioritys[i].path) == 0){
            aPriority = prioritys[i].p;
            break;
        }
    }
    for(var i in prioritys){
        if(b.indexOf(prioritys[i].path) == 0){
            bPriority = prioritys[i].p;
            break;
        }
    }

    if(aPriority < bPriority){
        return -1;
    }else if(aPriority > bPriority){
        return 1;
    }else{
        if (a < b) {
            return -1;
        }
        else {
            return 1;
        }
    }
};

readDirectory("./", fileHandler);

files.sort(sortFunc);
fs.writeFileSync("./files.json", JSON.stringify(files, null, 4));

module.exports = files;