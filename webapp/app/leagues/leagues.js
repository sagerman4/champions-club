angular.module('anal.leagues', ['ui.router', 'ui.bootstrap']);

angular.module('anal.leagues').service('LeaguesModel', function() {
  this.setLeagues = function(leagues) {
    this.leagues = leagues;
  };
  this.getLeagues = function(){
    return this.leagues;
  }
});

angular.module('anal.leagues').service('LeaguesService', function ($http) {
    this.getLeagues = function () {
        return $http.get("api/leagues").then(function success(response) {
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


    
    this.getPlayer = function (id) {
        return $http.get("api/players/" + id).then(function success(response) {
            return response.data[0];
        });
    };
});