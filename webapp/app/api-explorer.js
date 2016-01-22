angular.module('app.api-explorer', ['ui.router', 'ui.bootstrap'])
	.config(['$stateProvider', function($stateProvider){
		$stateProvider.state('api-explorer', {url: "/api-explorer", templateUrl: "api-explorer.html"});
	}]);

angular.module('app.api-explorer', ['ui.router', 'ui.bootstrap'])
    .config(['$stateProvider', 
          function($stateProvider) {
              $stateProvider.state('leagues', {url: '/leagues', templateUrl: 'leagues.html'});
          }
      ]
    );

angular.module('app.api-explorer').controller('NewMessageController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService){
    $scope.createMessage = function() {
       MessagesService.createMessage($scope.subject, $scope.body).then(function(response){
           $state.go('api-explorer');
       });
    };
}]);