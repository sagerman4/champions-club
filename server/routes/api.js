var _ = require('underscore'),
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
    'seasonKeys': {
        get: function(req, res) {
             FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/game/nfl?format=json')
                .done(function(data) {
                    res.json(data);
                });
        }
    },
    'leagues/:id/players': {
        get: function(req, res) {
            var keys = _.map(req.query, function(val, key) {
                return val;
            }).join();  

            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/players;player_keys=' + 
                    keys + '/stats?format=json')
                .done(function(data) {

                    var playerData = data.fantasy_content.league[1].players,
                        players = [],
                        player = {},
                        stats = {};



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

                            stats = {};
                            _.each(value.player[1], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(val, key) {
                                        stats[key] = val;
                                    });
                                } 
                            });


                            if (value.player[1] && value.player[1].player_stats) {
                                player.points = value.player[1].player_points.total;
                            }

                            player.stats = stats;
                            players.push(player);
                        }
                    });

                    res.json(players);
                }, function(err) {
                    res.send(err);
                });

            
        }
    },
    'leagues/:id/players/stats/season/total': {
        get: function(req, res) {
            var keys = _.map(req.query, function(val, key) {
                return val;
            }).join();  

            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/players;player_keys=' + 
                    keys + '/stats?format=json')
                .done(function(data) {

                    var playerData = data.fantasy_content.league[1].players,
                        players = [],
                        player = {},
                        stats = {};



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

                            stats = {};
                            _.each(value.player[1], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(val, key) {
                                        stats[key] = val;
                                    });
                                } 
                            });


                            if (value.player[1] && value.player[1].player_stats) {
                                player.seasonTotalPoints = value.player[1].player_points.total;
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
    'leagues/:id/teams/:teamId/roster/players/week/:weekNumber': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + req.params.teamId + '/roster;week=' + req.params.weekNumber + '/players/stats?format=json')
                .done(function(data) {

                    var playerObjects = data.fantasy_content.team[1].roster[0].players;
                    var players = [];

                    _.each(playerObjects, function(value) {
                        if (value.player) {
                            player = {};
                            
                            _.each(value.player[0], function(kvp) {
                                if (kvp === Object(kvp)) {
                                    _.each(kvp, function(val, key) {
                                        player[key] = val;
                                    });
                                } 
                            });

                            if (value.player[3] && value.player[3].player_stats) {
                                player.points = value.player[3].player_points.total;
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
    'leagues/all': {
        get: function(req, res) {
            var keys = _.map(req.query, function(val, key) {
                return val;
            }).join();  

            console.log('url', 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + keys + '/leagues?format=json');

            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=' + keys + '/leagues?format=json')
                .done(function(data) {
                    var leagues = [];

                    _.each(data.fantasy_content.users[0].user[1].games, function(game){
                        if(game.game){
                            _.each(game.game[1].leagues, function(value) {
                                if (value.league) leagues.push(value.league[0]);
                            });    
                        }
                    });

                    res.json(leagues);
                });
        }
    },
    'leagues/:id/teams': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/teams/stats?format=json')
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

                            team.seasonTotalPoints = value.team[1].team_points.total;

                            teams.push(team);
                        }
                    });

                    res.json(teams);
                });
        }
    },
    'leagues/:id/settings': {
        get: function(req, res) {
            FantasySports
                .request(req, res)
                .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/settings?format=json')
                .done(function(data) {
                    var settings = data.fantasy_content.league[1].settings[0];

                    res.json(settings);
                });
        }
    },
    'leagues/:id/draftResults': {
        get: function(req, res) {
          FantasySports.request(req, res)
             .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + req.params.id + '/draftresults?format=json')
             .done(function(data) {
                res.json(data);
            }, function(err) {
                res.send(err);
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