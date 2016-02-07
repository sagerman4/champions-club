angular.module('anal.draft', ['ui.router', 'ui.bootstrap', 'anal.leagues', 'ngGrid', 'ngGridPlugins'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider.state('postseason', {url: '/postseason/:leagueId', templateUrl: 'draft.html'});
            }
        ]);

angular.module('anal.draft').controller('DraftController', ['$scope', '$state', '$stateParams', 'LeaguesService', 'LeaguesModel', 'ngGridPlugins', function ($scope, $state, $stateParams, LeaguesService, LeaguesModel, ngGridPlugins) {
        
        $scope.seasons = [];

        $scope.init = function () {
            if(!LeaguesModel.getLeagues()){
                LeaguesService.getLeagues().then(function(data){
                    LeaguesModel.setLeagues(data);
                    $scope.assignLeagues(LeaguesModel.getLeagues());
                });
            } else {
                $scope.assignLeagues(LeaguesModel.getLeagues());
            }
        };

        $scope.assignLeagues = function(leagues){
            $scope.leagues = leagues;
            _.each($scope.leagues, function(league){
                if(league.league_key===$stateParams.leagueId){
                    $scope.league = league;
                    $scope.getAllDemPlayas();
                }
            });
            
            if(!LeaguesModel.getAllLeagues()){
                LeaguesService.getAllLeagues().then(function(data){
                    LeaguesModel.setAllLeagues(data);
                    $scope.initiateLeagues();
                });
            } else {
                $scope.initiateLeagues();    
            }
        };

        $scope.initiateLeagues = function() {
            $scope.allLeagues = LeaguesModel.getAllLeagues();
            _.each($scope.allLeagues, function(league){
                if(league.league_key===$stateParams.leagueId){
                    $scope.season = league;
                    LeaguesService.getLeagueSettings(league.league_key).then(function(data){
                        $scope.leagueSettings = data;
                    });
                }
            });
            _.each($scope.allLeagues, function(league){
                if(league.name===$scope.season.name){
                    $scope.seasons.push(league);
                }
            });
            $scope.setItUpYo();
        };

        $scope.switchLeague = function(league){
            $state.go('postseason', {leagueId: league.league_key});
        };

        $scope.switchSeasons = function(season){
            $state.go('postseason', {leagueId: season.league_key});
        };

        $scope.getAllDemPlayas = function() {
            $scope.allDemPlayas = [];
            var index = 0;

            var callback = function(data){
                index = index + 25;
                if(!data || (data && data.length===0)){
                    return;
                }
                LeaguesService.getPlayersSeasonTotalPoints($scope.league.league_key, index).then(callback);
            };

            LeaguesService.getPlayersSeasonTotalPoints($scope.league.league_key, index).then(callback);
        };

        $scope.setItUpYo = function() {
            LeaguesService.getTeams($scope.season.league_key).then(function(data){
                $scope.teams = data;
                LeaguesService.getDraftResults($scope.season.league_key).then(function(data){
                    $scope.draftResults = data.fantasy_content.league[1].draft_results;

                    $scope.getTotalPointsScoredByEachTeamsDraft();


                    // The following lines gets all teams and weeks and rosters organized.  Still needs cost added and to marked as drafted, traded, etc.

                    // _.each($scope.teams, function(team){
                    //     team.weeks = [{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},
                    //     {players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []}];

                    //     _.each($scope.draftResults, function(result){
                    //         if(result.draft_result && result.draft_result.team_key===team.team_key){
                    //             team.weeks[0].players.push({player_key: result.draft_result.player_key, cost: result.draft_result.cost});
                    //         }
                    //     });
                    // });



                    // var currentTeam = 0;
                    // var currentWeek = 1;

                    // var callback = function(data){
                    //     $scope.teams[currentTeam].weeks[currentWeek].players = data;

                    //     currentWeek++;
                    //     if(currentWeek===17) {
                    //         if(currentTeam===$scope.teams.length-1) {
                    //             return;
                    //         }
                    //         currentWeek=1;
                    //         currentTeam++;
                    //     }
                    //     LeaguesService.getTeamRoster($scope.season.league_key, $scope.teams[currentTeam].team_key, currentWeek).then(callback);
                    // };

                    // LeaguesService.getTeamRoster($scope.season.league_key, $scope.teams[currentTeam].team_key, currentWeek).then(callback);
                });
            });
        };

        $scope.getTotalPointsScoredByEachTeamsDraft = function() {
            
            var playerKeys = [];
            _.each($scope.draftResults, function(result) {
                if(result.draft_result){
                    playerKeys.push(result.draft_result.player_key);
                }   
            });

            var start = 0;
            var end = 25;

            $scope.seasonTotals = [];

            var callback = function(data){
                $scope.seasonTotals = $scope.seasonTotals.concat(data);
                
                if(end===playerKeys.length){
                    $scope.organizeTotalsIntoTeams();
                    $scope.rankPlayers();
                    return;
                }

                start+=25;
                end+=25;
                if(end>playerKeys.length){
                    end = playerKeys.length;
                }
                LeaguesService.getPlayerSeasonTotalPoints($scope.season.league_key, playerKeys.slice(start, end)).then(callback);
            };

            LeaguesService.getPlayerSeasonTotalPoints($scope.season.league_key, playerKeys.slice(start, end)).then(callback);
        };

        $scope.organizeTotalsIntoTeams = function() {

            var teamTotals = {};
            var total;
            _.each($scope.teams, function(team){
                teamTotals[team.team_key] = {totalPoints: 0, name: team.name, logo_url: team.team_logos[0].team_logo.url, manager: team.managers[0].manager.nickname, actualTotalPoints: team.seasonTotalPoints};
            });

            _.each($scope.draftResults, function(result){
                if(result.draft_result){
                    _.each($scope.seasonTotals, function(playerTotal){
                        if(result.draft_result.player_key===playerTotal.player_key){
                            result.draft_result.seasonTotalPoints = playerTotal.seasonTotalPoints;
                            result.draft_result.name = playerTotal.name.full;
                            result.draft_result.position = playerTotal.eligible_positions[0].position;
                            result.draft_result.headshot = playerTotal.headshot.url;
                            result.draft_result.team_name = teamTotals[result.draft_result.team_key].name;
                            result.draft_result.manager = teamTotals[result.draft_result.team_key].manager;
                            teamTotals[result.draft_result.team_key].totalPoints+=Number(playerTotal.seasonTotalPoints);
                        }
                    });
                }
            });

            $scope.teamDraftedPlayersSeasonTotal = [];
            _.each(teamTotals, function(value, key){
                $scope.teamDraftedPlayersSeasonTotal.push({team_key: key, totalPoints: value.totalPoints, name: value.name, logo_url: value.logo_url, manager: value.manager, actualTotalPoints: value.actualTotalPoints});
            });

            $scope.teamDraftedPlayersSeasonTotal = _.sortBy($scope.teamDraftedPlayersSeasonTotal, 'totalPoints');
            $scope.teamDraftedPlayersSeasonTotal.reverse();
        };

        $scope.ranekdDraftedPlayers = [];

        $scope.rankPlayers = function() {
            $scope.rankedDraftedPlayers = [];
            _.each($scope.draftResults, function(result){
                if(result.draft_result){
                    $scope.rankedDraftedPlayers.push({player_key: result.draft_result.player_key, 
                                                      seasonTotalPoints: Number(result.draft_result.seasonTotalPoints), 
                                                      name: result.draft_result.name,
                                                      position: result.draft_result.position,
                                                      cost: Number(result.draft_result.cost),
                                                      pointsPerDollar: Number(result.draft_result.seasonTotalPoints) / Number(result.draft_result.cost),
                                                      headshot: result.draft_result.headshot,
                                                      teamName: result.draft_result.team_name,
                                                      manager: result.draft_result.manager,
                                                      team_key: result.draft_result.team_key});
                }
            }); 

            $scope.rankedByPointsPerDollarDraftedPlayers = _.sortBy($scope.rankedDraftedPlayers, 'pointsPerDollar');
            $scope.rankedByPointsPerDollarDraftedPlayers.reverse();              

            $scope.rankedDraftedPlayers = _.sortBy($scope.rankedDraftedPlayers, 'seasonTotalPoints');
            $scope.rankedDraftedPlayers.reverse();  

            var rank = 1;
            _.each($scope.rankedDraftedPlayers, function(player){
                player.rank = rank++;
            });

            $scope.byPosition = {};
            var rank = 1;
            _.each($scope.rankedDraftedPlayers, function(player){
                if(!$scope.byPosition[player.position]){
                    $scope.byPosition[player.position] = [];
                }

                $scope.byPosition[player.position].push(
                    { 
                      player_key: player.player_key, 
                      seasonTotalPoints: player.seasonTotalPoints, 
                      name: player.name,
                      position: player.position,
                      cost: player.cost,
                      pointsPerDollar: player.pointsPerDollar,
                      headshot: player.headshot,
                      teamName: player.teamName,
                      manager: player.manager,
                      rank: $scope.byPosition[player.position].length,
                      team_key: player.team_key
                    }
                );
            });
            $scope.determineRosters();
        };  

        $scope.determineRosters = function(){
            var teamRosters = {};
            _.each($scope.teams, function(team){
                teamRosters[team.team_key] = {
                    name: team.name, 
                    logo_url: team.team_logos[0].team_logo.url, 
                    manager: team.managers[0].manager.nickname,
                    roster: {}
                };

                _.each($scope.leagueSettings.roster_positions, function(rosterPosition){
                    var position = rosterPosition.roster_position.position;
                    var bestAtPosition;
                    _.each($scope.byPosition[position], function(player){
                        if(player.team_key===team.team_key && !bestAtPosition && !player.taken){
                            bestAtPosition = player;
                            player.taken=true;
                        }
                    });

                    teamRosters[team.team_key].roster[position] = bestAtPosition;
                });
            });
        };
    }]);