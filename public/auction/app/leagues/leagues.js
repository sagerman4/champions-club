angular.module('anal.leagues', ['ui.router', 'ui.bootstrap', 'anal.teams', 'anal.drafts'])
    .config(['$stateProvider', 
          function($stateProvider) {
              $stateProvider.state('leagues', {url: '/leagues', templateUrl: 'leagues.html'});
          }
      ]
    );

angular.module('anal.leagues').service('YahooLeaguesService', function ($http) {
  this.getLeagues = function() {
    var deferred = $q.defer();

    return $http.get("/api/yahoo/leagues/").then(function success(response){
      console.log('leagues', response.data);
        return response.data;
    });
  };
});

angular.module('anal.leagues').service('LeaguesService', function ($http) {
    this.getLeagues = function () {
        return $http.get("api/leagues").then(function success(response) {
            return response.data;
        });
    };
    
    this.getLeague = function (id) {
        return $http.get("api/leagues/" + id).then(function success(response) {
            return response.data[0];
        });
    };
    
    this.removeLeague = function (id) {
        return $http.delete("api/leagues/" + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createLeague = function (name) {
        return $http.post("api/leagues", {name: name}).then(function success(response) {
            return response;
        });
    };
    
    this.getSettings = function (id) {
        return $http.get("api/leagues/" + id + '/settings').then(function success(response) {
            return response.data[0];
        });
    };
});

angular.module('anal.leagues').controller('LeaguesController', ['$scope', '$state', 'LeaguesService', 'TeamsService', 'DraftsService', function($scope, $state, LeaguesService, TeamsService, DraftsService){
    $scope.init = function() {
       LeaguesService.getLeagues().then(function(data){
          $scope.leagues = data; 
       }); 
    }; 
    
    $scope.selectLeague = function(league) {
       TeamsService.getTeams(league.id).then(function(teams){
          LeaguesService.getSettings(league.id).then(function(settings){
              DraftsService.getDrafts(league.id).then(function(drafts){
                $scope.selectedLeague = league;
                $scope.selectedLeague.teams = teams;
                $scope.selectedLeague.settings = settings;
                $scope.selectedLeague.drafts = drafts;
              });
          });
       });
    };
    
    $scope.removeLeague = function(league) {
       LeaguesService.removeLeague(league.id).then(function(response){
         LeaguesService.getLeagues().then(function(data){
           $scope.leagues = data; 
         });  
       });
    };
    
    $scope.createLeague = function() {
       LeaguesService.createLeague($scope.newLeagueName).then(function(response){
          $scope.newLeagueName = '';
          LeaguesService.getLeagues().then(function(data){
            $scope.leagues = data; 
         }); 
       });
    };
}]);

angular.module('anal.leagues').controller('NewLeagueController', ['$scope', '$state', 'LeaguesService', function($scope, $state, LeaguesService){
    $scope.createLeague = function() {
       LeaguesService.createLeague($scope.leagueName).then(function(response){
           $state.go('leagues');
       });
    };
}]);