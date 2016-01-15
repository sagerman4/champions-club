'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

var Team = mongoose.model('Team', {
    _user: { 
        type: Number, 
        ref: 'User'
    },
    // The Yahoo ID
    team_key: String,
    players: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Player' 
    }]
});

module.exports = Team;