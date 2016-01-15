define(function(require) {
    var controllers = require("controllers/controllers");

    function LeagueCtrl(League, $routeParams, $q) {
        $q.all([
            League.getByKey($routeParams.id),
            League.teams($routeParams.id)
        ]).then(function(results) {
            this.info = results[0];
            this.teams = results[1];
        }.bind(this));
    }

    return controllers.controller("LeagueCtrl", LeagueCtrl);
});
