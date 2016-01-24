angular.module('app.bestdraft', ['ui.router', 'ui.bootstrap', 'app.leagues', 'app.league', 'app.players'])
	.config(['$stateProvider', function($stateProvider){
		$stateProvider.state('app.bestdraft', {url: "/bestdraft", templateUrl: "bestdraft.html"});
	}]);

angular.module('app.bestdraft').controller('BestDraftController', ['$scope', '$state', 'LeaguesService', 'LeagueService', 'PlayersService', function($scope, $state, LeaguesService, LeagueService, PlayersService){
    $scope.init = function() {
       LeaguesService.getLeagues().then(function(response){
           $scope.leagues = response;
           console.log('leagues', $scope.leagues);
       });
    };

    $scope.selectLeague = function(league){
      $scope.league = league;
      LeagueService.getTeams($scope.league.league_key).then(function(data){
        $scope.teams = data;
        LeagueService.getDraftResults($scope.league.league_key).then(function(data){
            $scope.draftResults = data.fantasy_content.league[1].draft_results;
            $scope.keys = [];
            _.each($scope.draftResults, function(result) {
                // var player = PlayersService.getPlayer(result.draft_result.player_key);
                if(result.draft_result){
                    $scope.keys.push(result.draft_result.player_key);
                }   
            });

            $scope.week = 0;
            var weeks = [];
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});
            weeks.push({players: [], keys: $scope.keys.slice(0)});

            var callback = function(data){
              _.each(data, function(player){
                var element = {key: player.player_key, points: player.stats.total};
                weeks[$scope.week].players.push(element);
              });
              weeks[$scope.week].keys.splice(0,25);

              if(weeks[$scope.week].players.length===$scope.keys.length){
                $scope.week++;
              }
              if($scope.week!==16){
                PlayersService.getWeeklyStats($scope.league.league_key, weeks[$scope.week].keys, $scope.week+1).then(callback);
              }
              if($scope.week===16){
                LeagueService.getTransactions($scope.league.league_key).then(function(results){
                  var trades = [];

                  _.each(results.transactions, function(transaction){
                    if(transaction.transaction && transaction.transaction[0] && transaction.transaction[0].type==='trade') {

                    var transactionPlayers = [];
                    _.each(transaction.transaction[1].players, function(tradeData){
                      if(tradeData.player && tradeData.player[0]) {
                        var playerData = tradeData.player[1].transaction_data[0];
                        playerData.player_key = tradeData.player[0][0].player_key;
                        transactionPlayers.push(playerData);
                      }
                    });

                    var transactionObject = {};
                    transactionObject.players = transactionPlayers;

                    trades.push(transactionObject);
                    }
                  });


                  var draftedPlayerTrades = [];
                  _.each($scope.keys, function(key){
                    _.each(trades, function(trade){
                      _.each(trade.players, function(player){
                        if(player.player_key===key){
                          draftedPlayerTrades.push({key: key, trade: trade});
                        }
                      });
                    });
                  });

                  _.each(weeks, function(week){

                  });
                });
              }
              return;
            };

            PlayersService.getWeeklyStats($scope.league.league_key, weeks[$scope.week].keys, $scope.week+1).then(callback);

            // $scope.playerResults = [];

            // var callback = function(data){
            //     $scope.playerResults = $scope.playerResults.concat(data);
            //     if(data.length===$scope.keys.length){
            //         $scope.organizeIntoTeams();
            //         return;
            //     }
            //     $scope.keys.splice(0,25);
            //     PlayersService.getPlayers(league.league_key, $scope.keys).then(callback);
            // };

            // PlayersService.getPlayers(league.league_key, $scope.keys).then(callback);


        });
      });
    };


}]);





// Transaction
// "player": [
//                 [
//                   {
//                     "player_key": "348.p.8907"
//                   },
//                   {
//                     "player_id": "8907"
//                   },
//                   {
//                     "name": {
//                       "full": "Gary Barnidge",
//                       "first": "Gary",
//                       "last": "Barnidge",
//                       "ascii_first": "Gary",
//                       "ascii_last": "Barnidge"
//                     }
//                   },
//                   {
//                     "editorial_team_abbr": "Cle"
//                   },
//                   {
//                     "display_position": "TE"
//                   },
//                   {
//                     "position_type": "O"
//                   }
//                 ],
//                 {
//                   "transaction_data": [
//                     {
//                       "type": "trade",
//                       "source_type": "team",
//                       "source_team_key": "348.l.47496.t.1",
//                       "source_team_name": "The REPEAT Offenders",
//                       "destination_type": "team",
//                       "destination_team_key": "348.l.47496.t.8",
//                       "destination_team_name": "Charles in Charge"
//                     }
//                   ]
//                 }
//               ]