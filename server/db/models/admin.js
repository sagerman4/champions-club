'use strict';
var mongoose = require('mongoose');

var Admin = mongoose.model('Admin', {
    yahoo_id: String
});

module.exports = Admin;