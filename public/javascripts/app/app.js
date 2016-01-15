define(function(require) {
    var angular = require("angular"),
        app;
    
    require("controllers");
    require("directives");
    require("services");
    require("ngRoute");
    require("admin");

    app = angular.module("app", [
            "ngRoute",
            "coin.controllers",
            "coin.services",
            "coin.directives",
            "coin.admin" ]);
    
    app.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/javascripts/views/home.html",
                controller: "HomeCtrl",
                controllerAs: "home"
            })
            .otherwise({
                template: "<h1>Not found</h1>"
            });
    });

    window.app = app;

    return app;
});