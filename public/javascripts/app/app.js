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
            .when("/rules", {
                templateUrl: "/javascripts/views/rules.html",
                controller: "RulesCtrl",
                controllerAs: "rules"
            })
            .when("/history", {
                templateUrl: "/javascripts/views/history.html"
            })
            .when("/players", {
                templateUrl: "/javascripts/views/players.html",
                controller: "PlayersCtrl",
                controllerAs: "players"
            })
            .when("/leagues", {
                templateUrl: "/javascripts/views/leagues.html",
                controller: "LeaguesCtrl",
                controllerAs: "leagues"
            })
            .when("/leagues/:id", {
                templateUrl: "/javascripts/views/league.html",
                controller: "LeagueCtrl",
                controllerAs: "league"
            })
            .when("/teams", {
                templateUrl: "/javascripts/views/teams.html",
                controller: "TeamsCtrl"
            })
            .when("/teams/:id", {
                templateUrl: "/javascripts/views/team.html",
                controller: "TeamCtrl"
            })
            .when("/sandbox", {
                templateUrl: "javascripts/views/sandbox.html",
                controller: "SandboxCtrl"
            })
            .when("/admin/:tool", {
                templateUrl: "javascripts/views/admin/index.html",
                controller: "AdminCtrl",
                controllerAs: "admin"
            })
            .otherwise({
                template: "<h1>Not found</h1>"
            });
    });

    window.app = app;

    return app;
});