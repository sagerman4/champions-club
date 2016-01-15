'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = mongoose.model('User', {
    first: String,
    last: String,
    yahoo_id: String,
    teams: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    }],
    displayAge: Number,
    gender: String,
    imageUrl: String,
    location: String,
    nickname: String,
    profileUrl: String
});

module.exports = User;