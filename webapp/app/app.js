var messages = angular.module('messages', ['ui.router', 'ui.bootstrap', 'messages.new']);

messages.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/messages");
    $stateProvider
          .state('messages', {url: "/messages", templateUrl: "messages.html"})
          .state('new', {url: "/new", templateUrl: "new.html"});
  }]);

messages.controller('NavController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService) {
  $scope.init = function() {
    $scope.$state = $state;
    $scope.total = MessagesService.getMessages().length;
  };
}]);

messages.service('MessagesService', function ($http) {
    this.getMessages = function () {
        return [{subject: 'something', body: 'adriana'},{subject: 'something', body: 'rachel leigh'}];
    };
    
    this.getMessage = function (id) {
        return {subject: 'something', body: 'rachel leigh'};  
    };
    
    this.removeMessage = function (id) {
        return $http.delete("api/messages/" + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createMessage = function (subject, body) {
        return $http.post("api/messages", {subject: subject, body: body}).then(function success(response) {
            return response;
        });
    };
});

messages.controller('MessagesController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService){
    $scope.init = function() {
       $scope.messages = MessagesService.getMessages();
    }; 
    
    $scope.selectMessage = function(message) {
       $scope.selectedMessage = message;  
    };
    
    $scope.removeMessage = function(message) {
       MessagesService.removeMessage(message.id).then(function(response){
         MessagesService.getMessages().then(function(data){
           $scope.messages = data; 
         });  
       });
    };
}]);

messages.config(['$httpProvider', function($httpProvider) {
   $httpProvider.interceptors.push(function() {
      return {
        request: function(config) {
          if ('GET' !== config.method) {
            return config;
          }

          if (config.url.match(/(js\/|css\/|img\/|font\/)/g)) {
            var seperator = config.url.indexOf('?') === -1 ? '?' : '&';
            config.url = config.url + seperator + 'v=VERSION_TOKEN';
          }
          return config;
        }
      };
    });
  }]);