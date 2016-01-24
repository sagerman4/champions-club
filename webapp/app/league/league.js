angular.module('app.league', ['ui.router', 'ui.bootstrap']);


angular.module('app.league').service('LeagueService', function ($http) {
    this.getDraftResults = function (id) {
        return $http.get("api/leagues/" + id + "/draftResults").then(function success(response) {
            return response.data;
        });
    };

    this.getTeams = function (leagueId) {
        return $http.get('api/leagues/' + leagueId + '/teams').then(function success(response) {
            return response.data;
        });
    };

    this.getTransactions = function (id) {
        return $http.get("api/leagues/" + id + "/transactions").then(function success(response) {
            return response.data;
        });
    };
});