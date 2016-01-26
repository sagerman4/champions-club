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
            console.log('league', $scope.league);
        };
    }]);