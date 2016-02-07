angular.module('anal.leagues', ['ui.router', 'ui.bootstrap']);

angular.module('anal.leagues').service('LeaguesModel', function() {
  this.setLeagues = function(leagues) {
    this.leagues = leagues;
  };
  this.getLeagues = function(){
    return this.leagues;
  };
  this.setAllLeagues = function(allLeagues) {
    this.allLeagues = allLeagues;
  };
  this.getAllLeagues = function(){
    return this.allLeagues;
  };
});

angular.module('anal.leagues').service('LeaguesService', function ($http) {
    
    this.getLeagues = function () {
        return $http.get("api/leagues").then(function success(response) {
            return response.data;
        });
    };

    this.getAllLeagues = function () {
        var gameKeyString = "?";
        _.each(this.gameKeys, function(key){
            if(gameKeyString.length>1){
                gameKeyString+="&";
            }
            gameKeyString+="gameKey=";
            gameKeyString+=key.gameKey;
        });
        return $http.get("api/leagues/all" + gameKeyString).then(function success(response) {
            return response.data;
        });
    };
    
    // What type of league data are we expecting here? Does yahoo have it?
    this.getLeague = function (id) {
        return $http.get("api/leagues/" + id).then(function success(response) {
            return response.data[0];
        });
    };

    this.getTeams = function(leagueId) {
        return $http.get('api/leagues/' + leagueId + '/teams').then(function success(response) {
            return response.data;
        });  
    };

    this.getTeamRoster = function(leagueId, teamId, week) {
        return $http.get('api/leagues/' + leagueId + '/teams/' + teamId + '/roster/players/week/'+week).then(function success(response) {
            return response.data;
        });  
    };

    this.getDraftResults = function (id) {
        return $http.get("api/leagues/" + id + "/draftResults").then(function success(response) {
            return response.data;
        });
    };

    this.getLeagueSettings = function (id) {
        return $http.get("api/leagues/" + id + "/settings").then(function success(response) {
            return response.data;
        });
    };

    this.getPlayerSeasonTotalPoints = function (leagueId, playerKeys) {
        var keysString = '?';

        if(playerKeys.length>25) {
            console.log('WARNING: only 25 player keys will be used.  Yahoo! API only returns 25 results.');
        }

        var i=0;
        _.every(playerKeys, function(key){
            if(i>0){
                keysString+='&';
            }
            keysString += 'key=' + key;
            
            i++;

            return i<25;
        });


        return $http.get('api/leagues/' + leagueId + '/players/stats/season/total' + keysString)
            .then(
                function success(response) {
                    return response.data;
                }
            );
    };

    this.getPlayersSeasonTotalPoints = function (leagueId, index) {
        return $http.get('api/leagues/' + leagueId + '/players/stats/season/totals/' + index)
            .then(
                function success(response) {
                    console.log('result', response.data);
                    return response.data;
                }
            );
    };

    this.getPlayer = function (id) {
        return $http.get("api/players/" + id).then(function success(response) {
            return response.data[0];
        });
    };

    this.getSeasons = function() {
        return this.gameKeys;
    };

    this.gameKeys = [
                {gameKey: "348", year: "2015"},
                {gameKey: "331", year: "2014"},
                {gameKey: "314", year: "2013"},
                {gameKey: "273", year: "2012"},
                {gameKey: "257", year: "2011"},
                {gameKey: "242", year: "2010"} 
                ];
});