define(function (require) {
    var directives = require("directives/directives"),
        markdown = require("markdown");

    function CoinTeamList() {
        return {
            restrict: "E",
            templateUrl: "javascripts/app/directives/templates/coinTeamList.html",
            scope: {
                teams: "="
            }
        };
    }

    return directives.directive("coinTeamList", CoinTeamList);
});