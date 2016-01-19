angular.module('anal.players', ['ui.router', 'ui.bootstrap']);

angular.module('anal.players').service('PlayersService', function ($http) {
    this.getPlayers = function () {
        return $http.get("api/players").then(function success(response) {
            return response.data;
        });
    };
    
    this.getPlayer = function (id) {
        return $http.get("api/players/" + id).then(function success(response) {
            return response.data[0];
        });
    };
});