var oa = require('../utils/oauth'),
    _ = require('underscore'),
    fs = require('fs'),
    FantasySports = require('FantasySports');

FantasySports.options(require('../config.js'));

/*
Leagues
http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json
Or,
http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues?format=json

Leagues/Teams
http://fantasysports.yahooapis.com/fantasy/v2/league/331.l.135247/teams?format=json
Player Search
http://fantasysports.yahooapis.com/fantasy/v2/league/331.l.135247/players;search=smith?format=json

Transactions
http://fantasysports.yahooapis.com/fantasy/v2/league/331.l.198983/transactions?format=json
<?xml version="1.0" encoding="UTF-8" ?>
<fantasy_content>
    <transaction>
        <type>drop</type>
        <player>
            <player_key>331.p.24869</player_key>
            <transaction_data>
                <type>drop</type>
                <source_team_key>331.l.198983.t.2</source_team_key>
            </transaction_data>
        </player>
    </transaction>
</fantasy_content>
*/
module.exports = {
    'profile/:id': {
        get: function(req, res) {
             FantasySports
                .request(req, res)
                .api('https://social.yahooapis.com/v1/user/ID/profile/usercard?format=json'.replace('ID', req.params.id))
                .done(function(data) {
                    res.json(data.profile);
                });
        }
    },
    'leagues/:id/players': {
        get: function(req, res) {
            var queryString = _.map(req.query, function(val, key) {
                return key + '=' + val;
            }).join(';');  

            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/players;' + 
                    queryString + 
                    '?format=json')
                .done(function(data) {
                    var playerData = data.fantasy_content.league[1].players,
                        players = [],
                        player = {};

                    _.each(playerData, function(value) {
                        if (value.player) {
                            player = {};
                            
                            _.each(value.player[0], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(val, key) {
                                        player[key] = val;
                                    });
                                } 
                            });

                            if (value.player[1] && value.player[1].player_stats) {
                                player.points = value.player[1].player_points.total;
                            }

                            players.push(player);
                        }

                    });

                    res.json(players);
                }, function(err) {
                    res.send(err);
                });

            
        }
    },
    'leagues/:id/setup': { 
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '?format=json')
                .done(function(data) {
                    var league = data.fantasy_content.league;

                    res.json(league);
                });
        }
    },
    'leagues': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json')
                .done(function(data) {
                    var leagueData = data.fantasy_content.users[0].user[1].games[0].game[1].leagues,
                        leagues = [];

                    _.each(leagueData, function(value) {
                        if (value.league) leagues.push(value.league[0]);
                    });

                    res.json(leagues);
                });
        }
    },
    'leagues/:id/teams': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/teams?format=json')
                .done(function(data) {
                    var teamData = data.fantasy_content.league[1].teams,
                        teams = [],
                        team;

                    _.each(teamData, function(value) {
                        if (value.team) {
                            team = {};
                            
                            _.each(value.team[0], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(val, key) {
                                        team[key] = val;
                                    });
                                } 
                            });

                            teams.push(team);
                        }
                    });

                    res.json(teams);
                });
        }
    },
    'teams/:id': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + req.params.id + '/players?format=json')
                .done(function(data) {
                    var teamData = data.fantasy_content.team[0],
                        playerData = data.fantasy_content.team[1].players,
                        players = [],
                        team = {};

                    _.each(teamData, function(kvp) {
                        _.each(kvp, function(value, key) {
                            if (kvp === Object(kvp)) {
                                team[key] = value;
                            }
                        });
                    });


                    _.each(playerData, function(p) {
                        if (p.player) {
                            var player = {};

                            _.each(p.player[0], function(kvp) {
                                _.each(kvp, function(value, key) {
                                    if (kvp === Object(kvp)) {
                                        player[key] = value;
                                    }
                                });
                            });

                            players.push(player);
                        }
                    });

                    team.players = players;

                    res.json(team);
                });
        }
    },
    teams: {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/teams?format=json')
                .done(function(json) {
                    var teamsData = {},
                        teams = [];
                    
                    teamsData = json.fantasy_content.users[0]
                            .user[1]
                            .games[0]
                            .game[1]
                            .teams;

                    _.each(teamsData, function(obj) {
                        var teamData = {};

                        if (obj.team) {
                            _.each(obj.team[0], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(value, key) {
                                        teamData[key] = value;
                                    });
                                }
                            });

                            teams.push(teamData);
                        }
                    });

                    res.json(teams);
                });
        }
    },
    sandbox: {
        post: function(req, res) {
            
            FantasySports
                .request(req, res)
                .api(req.body.url, req.body.data)
                .done(function(data) {
                    res.json(data);
                }, function(err) {
                    res.json(err);
                });
        }
    }
};