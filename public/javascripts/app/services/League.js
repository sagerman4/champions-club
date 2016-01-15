define(function (require) {
    var services = require("services/services");

    function League($http, $q) {
        var self = this;

        this.leagues = [];
        
        this.teams = function(key) {
            var deferred = $q.defer();

            $http({
                method: "get",
                url: "/api/leagues/" + key + "/teams"
            }).success(function(teams) {
                deferred.resolve(teams);
            });

            return deferred.promise;
        };

        this.getByKey = function(key) {
            var deferred = $q.defer(),
                league;

            self.all().then(function(leagues) {
                league = leagues.filter(function(league) {
                    return league.league_key === key;
                })[0];

                deferred.resolve(league);
            });

            return deferred.promise;
        };
        
        this.all = function() {
            var deferred = $q.defer();

            if (!self.leagues.length) {
                $http({
                    method: "get",
                    url: "/api/leagues/"
                }).success(function(leagues) {
                    leagues.forEach(function(league) {
                        self.leagues.push(league);
                    });

                    deferred.resolve(self.leagues);
                });
            }
            else {
                deferred.resolve(this.leagues);
            }
            
            return deferred.promise;
        };

        this.searchForPlayer = function(leagueKey, query) {
            return $http({
                method: "get",
                url: "/api/leagues/" + leagueKey + "/players/",
                params: {
                    search: query
                }
            });
        };
    }

    return services.service("League", League);
});