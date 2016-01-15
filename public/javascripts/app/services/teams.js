define(function (require) {
    var services = require("services/services");

    function Teams($http) {
        return {
            team: function(id) {
                return $http({
                    method: "get",
                    url: "/api/teams/" + id
                });
            },
            teams: function() {
               return $http({
                    method: "get",
                    url: "/api/teams"
                });
            }
        };
    }

    return services.factory("Teams", Teams);
});