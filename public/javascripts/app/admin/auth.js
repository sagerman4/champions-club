define(function (require) {
    var admin = require("admin/adminModule");

    admin.factory("auth", ["$http", "$q", function($http, $q) {
        var isAdmin = null;

        return {
            isAdmin: function(id) {
                var deferred = $q.defer();

                if (isAdmin === null) {
                    $http({
                        type: "GET",
                        url: "/api/admin/authenticate/" + id
                    }).success(function(json) {
                        isAdmin = json.data;
                        deferred.resolve(json.data);
                    });
                } 
                else {
                    deferred.resolve(isAdmin);
                }

                return deferred.promise;
            }
        }; 
    }]);
});