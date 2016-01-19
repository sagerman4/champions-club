angular.module('anal.players', ['ui.router', 'ui.bootstrap']);

angular.module('anal.players').service('PlayersService', function ($http) {
    this.getPlayers = function (leagueId, playerKeys) {
        var keysString = '?';

        var i=0;
        _.every(playerKeys, function(key){
            if(i>0){
                keysString+='&';
            }
            keysString += 'key=' + key;
            
            i++;

            return i<25;
        });


        return $http.get('api/leagues/' + leagueId + '/players' + keysString)
            .then(
                function success(response) {
                    console.log('number of results: ', response.data.length);
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