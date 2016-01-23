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
            $scope.playerKeys = [];
            _.each($scope.draftResults, function(result) {
                // var player = PlayersService.getPlayer(result.draft_result.player_key);
                if(result.draft_result){
                    $scope.playerKeys.push(result.draft_result.player_key);
                }   
            });

            $scope.players = [];

            // var callback = function(data){
            //   $scope.
            // };

            PlayersService.getWeeklyStats($scope.league.league_key, $scope.playerKeys, '1').then(function(data){
              console.log('something', data);
            });

            // $scope.playerResults = [];

            // var callback = function(data){
            //     $scope.playerResults = $scope.playerResults.concat(data);
            //     if(data.length===$scope.playerKeys.length){
            //         $scope.organizeIntoTeams();
            //         return;
            //     }
            //     $scope.playerKeys.splice(0,25);
            //     PlayersService.getPlayers(league.league_key, $scope.playerKeys).then(callback);
            // };

            // PlayersService.getPlayers(league.league_key, $scope.playerKeys).then(callback);


        });
      });
    };


}]);