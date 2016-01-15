'use strict';

var User = require('../db/models/user');

exports.list = function(req, res){
    User.find(function(err, users) {
        res.send(users);
    });
};