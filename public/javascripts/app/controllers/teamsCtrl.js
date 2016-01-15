define(function(require) {
    var controllers = require("controllers/controllers");

    function TeamsCtrl($scope, $http, Teams) {
        Teams.teams().success(function(data) {
            $scope.teams = data;
        });
    }

    return controllers.controller('TeamsCtrl', TeamsCtrl);
});