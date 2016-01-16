var app = angular.module('app', ['ngRoute', 'coin.controllers', 'coin.services', 'coin.directives', 'coin.admin']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/javascripts/views/index.html",
            controller: "HomeCtrl",
            controllerAs: "home"
        })
        .otherwise({
            template: "<h1>Not found</h1>"
        });
});