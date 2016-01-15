define(function(require) {
    var controllers = require("controllers/controllers");

    function SandboxCtrl ($scope, $http) {
        $scope.url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/teams?format=json';

        $scope.send = function(url, data) {
            $http({
                method: 'post',
                url: '/api/sandbox',
                data: {
                    url: url,
                    data: data
                }
            }).success(function(data) {
                $scope.results = JSON.stringify(data, null, 4);
            });
        };
    }

    return controllers.controller('SandboxCtrl', SandboxCtrl);
});
