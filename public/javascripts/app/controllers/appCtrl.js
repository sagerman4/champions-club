define(function(require) {
    var controllers = require("controllers/controllers");

    function AppCtrl(User, $scope, auth) {
        $scope.user = User;
        auth.isAdmin(User.yahoo_id)
            .then(function(isAdmin) {
                $scope.isAdmin = isAdmin;
            });
    }

    return controllers.controller("AppCtrl", AppCtrl);
});
