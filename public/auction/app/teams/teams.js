angular.module('anal.teams', ['ui.router', 'ui.bootstrap'])
    .config(['$stateProvider', 
          function($stateProvider) {
              $stateProvider.state('teams', {url: '/teams', templateUrl: 'teams.html'});
          }
      ]
    );

angular.module('anal.teams').service('TeamsService', function ($http) {
    this.getTeams = function (leagueId) {
        return $http.get('api/leagues/' + leagueId + '/teams').then(function success(response) {
            return response.data;
        });
    };
    
    this.getTeam = function (leagueId, id) {
        return $http.get('api/leagues/' + leagueId + '/teams/' + id).then(function success(response) {
            return response.data[0];
        });
    };
    
    this.removeTeam = function (leagueId, id) {
        return $http.delete('api/leagues/' + leagueId + '/teams/' + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createTeam = function (leagueId, name) {
        return $http.post('api/leagues/' + leagueId + '/teams', {name: name}).then(function success(response) {
            return response;
        });
    };
});