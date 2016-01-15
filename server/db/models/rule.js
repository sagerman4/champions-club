'use strict';
var mongoose = require('mongoose');

var Rule = mongoose.model('Rule', {
    name: String,
    value: String
});

module.exports = Rule;