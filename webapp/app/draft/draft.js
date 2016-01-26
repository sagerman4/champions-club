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
                LeaguesService.getTeamRoster($scope.league.league_key, $scope.teams[0].team_key).then(function(data){
                    console.log('roster', data);
                });
            });
        };
    }]);


                    // {
                    //   "name": {
                    //     "full": "Tyrod Taylor",
                    //     "first": "Tyrod",
                    //     "last": "Taylor",
                    //     "ascii_first": "Tyrod",
                    //     "ascii_last": "Taylor"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Antonio Brown",
                    //     "first": "Antonio",
                    //     "last": "Brown",
                    //     "ascii_first": "Antonio",
                    //     "ascii_last": "Brown"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Brandin Cooks",
                    //     "first": "Brandin",
                    //     "last": "Cooks",
                    //     "ascii_first": "Brandin",
                    //     "ascii_last": "Cooks"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Todd Gurley",
                    //     "first": "Todd",
                    //     "last": "Gurley",
                    //     "ascii_first": "Todd",
                    //     "ascii_last": "Gurley"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Tim Hightower",
                    //     "first": "Tim",
                    //     "last": "Hightower",
                    //     "ascii_first": "Tim",
                    //     "ascii_last": "Hightower"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Travis Kelce",
                    //     "first": "Travis",
                    //     "last": "Kelce",
                    //     "ascii_first": "Travis",
                    //     "ascii_last": "Kelce"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Cameron Artis-Payne",
                    //     "first": "Cameron",
                    //     "last": "Artis-Payne",
                    //     "ascii_first": "Cameron",
                    //     "ascii_last": "Artis-Payne"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Jay Cutler",
                    //     "first": "Jay",
                    //     "last": "Cutler",
                    //     "ascii_first": "Jay",
                    //     "ascii_last": "Cutler"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Odell Beckham Jr.",
                    //     "first": "Odell",
                    //     "last": "Beckham Jr.",
                    //     "ascii_first": "Odell",
                    //     "ascii_last": "Beckham Jr."
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Theo Riddick",
                    //     "first": "Theo",
                    //     "last": "Riddick",
                    //     "ascii_first": "Theo",
                    //     "ascii_last": "Riddick"
                    //   }
                    // },
                    //   "name": {
                    //     "full": "Jeremy Hill",
                    //     "first": "Jeremy",
                    //     "last": "Hill",
                    //     "ascii_first": "Jeremy",
                    //     "ascii_last": "Hill"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Ted Ginn Jr.",
                    //     "first": "Ted",
                    //     "last": "Ginn Jr.",
                    //     "ascii_first": "Ted",
                    //     "ascii_last": "Ginn Jr."
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Jermaine Kearse",
                    //     "first": "Jermaine",
                    //     "last": "Kearse",
                    //     "ascii_first": "Jermaine",
                    //     "ascii_last": "Kearse"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Graham Gano",
                    //     "first": "Graham",
                    //     "last": "Gano",
                    //     "ascii_first": "Graham",
                    //     "ascii_last": "Gano"
                    //   }
                    // },
                    // {
                    //   "name": {
                    //     "full": "Denver",
                    //     "first": "Denver",
                    //     "last": "",
                    //     "ascii_first": "Denver",
                    //     "ascii_last": ""
                    //   }
                    // },
                    // {