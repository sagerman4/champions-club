'use strict';

var mongoose = require('mongoose'),
    db = mongoose.connection,
    User = require('./models/user');

mongoose.connect('mongodb://MongoLab-25:Zqy8wu31J5C6E9Dhxf6Q4t2cyf8ckVkS8dWrnCiMOvw-@ds027748.mongolab.com:27748/MongoLab-25');

db.on('error', console.error.bind(console, 'connection error:'));

exports.db = db;