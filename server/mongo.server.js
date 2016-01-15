'use strict';

var http = require('http'),
    mongo = require('mongoskin'),
    _ = require('underscore');

http.createServer(function (req, res) {
    var connect = function(next){
        var db = mongo.db(process.env.MONGO_URL, {safe : true});
        next(db);
    };

    connect(function(db) {
        var out = [];

        db.collectionNames(function(err, collNames) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(err));
            }

            _.each(collNames, function(collName) {
                var cleanName = collName.name.replace("MongoLab-25" + ".","");
                var formatted = {
                    name : cleanName,
                    details : "MongoLab-25" + "/" + cleanName,
                    database : "MongoLab-25",
                    type : "collection"
                };

                if(cleanName != "system.indexes") out.push(formatted);
            });
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Hello, world!' + JSON.stringify(out));
        });
    });
    
}).listen(process.env.PORT || 8080);