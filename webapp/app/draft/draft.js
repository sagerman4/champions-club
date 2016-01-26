angular.module('anal.draft', ['ui.router', 'ui.bootstrap', 'anal.leagues'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider.state('draft', {url: '/draft', templateUrl: 'draft.html'});
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

                    _.each($scope.teams, function(team){
                        team.weeks = [{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},
                        {players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []},{players: []}];

                        _.each($scope.draftResults, function(result){
                            if(result.draft_result && result.draft_result.team_key===team.team_key){
                                team.weeks[0].players.push({player_key: result.draft_result.player_key, cost: result.draft_result.cost});
                            }
                        });
                    });

                    LeaguesService.getTeamRoster($scope.league.league_key, $scope.teams[0].team_key, 1).then(function(data){
                        console.log('roster', data);
                    });
                });
            });
        };
    }]);