angular.module('messages.new', ['ui.router', 'ui.bootstrap'])
	.config(['$stateProvider', function($stateProvider){
		$stateProvider.state('new', {url: "/new", templateUrl: "new.html"});
	}]);

angular.module('messages.new', ['ui.router', 'ui.bootstrap'])
    .config(['$stateProvider', 
          function($stateProvider) {
              $stateProvider.state('leagues', {url: '/leagues', templateUrl: 'leagues.html'});
          }
      ]
    );

angular.module('messages.new').controller('NewMessageController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService){
    $scope.createMessage = function() {
       MessagesService.createMessage($scope.subject, $scope.body).then(function(response){
           $state.go('messages');
       });
    };
}]);