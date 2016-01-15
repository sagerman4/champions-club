define(function(require) {
    var controllers = require("controllers/controllers");

    function LeaguesCtrl(League) {
        League.all().then(function(leagues) {
            this.leagues = leagues;
        }.bind(this));
    }

    return controllers.controller("LeaguesCtrl", LeaguesCtrl);
});
