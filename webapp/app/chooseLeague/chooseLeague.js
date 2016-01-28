angular.module('anal.chooseLeague', ['ui.router', 'ui.bootstrap', 'anal.leagues'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider.state('chooseLeague', {url: '/chooseLeague', templateUrl: 'chooseLeague.html'});
            }
        ]);

angular.module('anal.chooseLeague').controller('LeagueChoosinController', ['$scope', '$state', '$stateParams', 'LeaguesService', function ($scope, $state, $stateParams, LeaguesService) {
    $scope.init = function () {
        LeaguesService.getLeagues().then(function (data) {
            $scope.leagues = data;
        });
    };
}]);