angular.module('anal.draft', ['ui.router', 'ui.bootstrap', 'anal.leagues'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider.state('postseason', {url: '/postseason', templateUrl: 'draft.html'});
            }
        ]);

angular.module('anal.draft').controller('DraftController', ['$scope', '$state', '$stateParams', 'LeaguesService', function ($scope, $state, $stateParams, LeaguesService, ngGridPlugins) {
        $scope.chartDataPointsByPosition = [];

        $scope.init = function () {
            LeaguesService.getLeagues().then(function (data) {
                $scope.leagues = data;
            });
        };

        $scope.selectLeague = function (league) {
            $scope.league = league;
            LeaguesService.getTeams($scope.league.league_key).then(function(data){
                $scope.teams = data;
                LeaguesService.getDraftResults($scope.league.league_key).then(function(data){
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
                    //     LeaguesService.getTeamRoster($scope.league.league_key, $scope.teams[currentTeam].team_key, currentWeek).then(callback);
                    // };

                    // LeaguesService.getTeamRoster($scope.league.league_key, $scope.teams[currentTeam].team_key, currentWeek).then(callback);
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
                    return;
                }

                start+=25;
                end+=25;
                if(end>playerKeys.length){
                    end = playerKeys.length;
                }
                LeaguesService.getPlayerSeasonTotalPoints($scope.league.league_key, playerKeys.slice(start, end)).then(callback);
            };

            LeaguesService.getPlayerSeasonTotalPoints($scope.league.league_key, playerKeys.slice(start, end)).then(callback);
        };

        $scope.organizeTotalsIntoTeams = function() {

            var teamTotals = {};
            var total;
            _.each($scope.teams, function(team){
                teamTotals[team.team_key] = {totalPoints: 0, name: team.name, logo_url: team.team_logos[0].team_logo.url, manager: team.managers[0].nickname, actualTotalPoints: team.seasonTotalPoints};
            });

            _.each($scope.draftResults, function(result){
                if(result.draft_result){
                    _.each($scope.seasonTotals, function(playerTotal){
                        if(result.draft_result.player_key===playerTotal.player_key){
                            result.draft_result.seasonTotalPoints = playerTotal.seasonTotalPoints;
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
    }]);