define(function (require) {
    var controllers = require("controllers/controllers");

    function TeamCtrl ($scope, Teams, $routeParams) {
        Teams.team($routeParams.id).success(function(data) {
            $scope.team = data;
        });
    }

    controllers.controller('TeamCtrl', TeamCtrl);
});