angular.module('anal.league', ['ui.router', 'ui.bootstrap', 'anal.teams', 'anal.drafts']);


angular.module('anal.league').service('LeagueService', function ($http) {
    this.getDraftResults = function (id) {
        return $http.get("api/leagues/" + id + "/draftResults").then(function success(response) {
            return response.data;
        });
    };

    this.getTeams = function () {
        return $http.get("api/leagues").then(function success(response) {
            return response.data;
        });
    };
});

angular.module('anal.league').controller('LeagueController', ['$stateParams', '$scope', '$state', 'LeagueService', 'TeamsService', 'DraftsService', function($scope, $state, LeaguesService, TeamsService, DraftsService){
    $scope.junk = 'junkie;'
    // $scope.init = function() {
    //   console.log('please work');
    //   $scope.leagueId = $stateParams.id;
    //   console.log('leaguecontroller, id=' + $scope.leagueId);
    //    LeaguesService.getDraftResults($scope.leagueId).then(function(data){
    //       $scope.draftResults = data;
    //    }); 
    // };
}]);