'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Player = mongoose.model('Player', {
        _player: { 
            type: Number, 
            ref: 'Team'
        },
        first: String,
        last: String,
        yahoo_id: String
});

module.exports = Player;