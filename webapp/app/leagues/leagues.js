angular.module('app.leagues', ['ui.router', 'ui.bootstrap']);

angular.module('app.leagues').service('LeaguesService', function ($http) {
    this.getLeagues = function () {
        return $http.get("api/leagues").then(function success(response) {
            return response.data;
        });
    };
});