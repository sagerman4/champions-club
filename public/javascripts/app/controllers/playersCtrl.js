define(function (require) {
    var controllers = require("controllers/controllers");

    function PlayersCtrl (League) {
        var self = this;

        this.query = {
            player: "",
            leagueKey: "",
            results: []
        };

        League.all().then(function(leagues) {
            this.leagues = leagues;

            this.query.leagueKey = this.leagues[0].league_key;
        }.bind(this));

        this.search = function() {
            League.searchForPlayer(this.query.leagueKey, this.query.player)
                .success(function(players) {
                    self.query.results = players;
                });
        };
    }

    return controllers.controller("PlayersCtrl", PlayersCtrl);
});