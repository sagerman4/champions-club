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

angular.module('app.api-explorer').controller('ApiExplorerController', ['$scope', '$state', 'ApiService', function($scope, $state, ApiService){
    $scope.executeCall = function() {
       ApiService.getApiResults($scope.apiurl).then(function(response){
           $scope.results = response;
       });
    };
}]);

angular.module('app.api-explorer').service('ApiService', function ($http) {
    this.getApiResults = function (url) {
        return $http.get("api/apiexplorer?url=" + url).then(function success(response) {
            return response.data;
        });
    };
});