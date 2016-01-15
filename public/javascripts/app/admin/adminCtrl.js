define(function(require) {
    var admin = require("admin/adminModule");

    function AdminCtrl(auth, User, League, $routeParams) {
        var self = this;

        this.activeTab = $routeParams.tool;        
        this.league = {};
        this.league.active = "";

        League.all().then(function(leagues) {
            self.league.list = leagues;
            self.league.active = leagues[0].league_key;

            self.listTeams(self.league.active);
        });

        auth.isAdmin(User.yahoo_id).then(function(admin) {
            self.welcome = admin ? "THE Fantasy League" : "You shall not pass!";    
        });

        this.listTeams = function(key) {
            League.teams(key).then(function(teams) {
                self.league.teams = teams;

                console.log(teams);
            });
        };


    }

    return admin.controller("AdminCtrl", AdminCtrl);
});
