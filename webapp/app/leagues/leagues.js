angular.module('anal.leagues', ['ui.router', 'ui.bootstrap']);

angular.module('anal.leagues').service('LeaguesService', function ($http) {
    this.getLeagues = function () {
        return $http.get("api/leagues").then(function success(response) {
            return response.data;
        });
    };
    
    // What type of league data are we expecting here? Does yahoo have it?
    this.getLeague = function (id) {
        return $http.get("api/leagues/" + id).then(function success(response) {
            return response.data[0];
        });
    };

    this.getTeams = function(leagueId) {
        return $http.get('api/leagues/' + leagueId + '/teams').then(function success(response) {
            return response.data;
        });  
    };

    this.getTeamRoster = function(leagueId, teamId, week) {
        return $http.get('api/leagues/' + leagueId + '/teams/' + teamId + '/roster/players/week/'+week).then(function success(response) {
            return response.data;
        });  
    };

    this.getDraftResults = function (id) {
        return $http.get("api/leagues/" + id + "/draftResults").then(function success(response) {
            return response.data;
        });
    };
});