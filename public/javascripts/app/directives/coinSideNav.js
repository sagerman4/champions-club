define(function (require) {
    var directives = require("directives/directives");

    function CoinSideNav() {
        return {
            restrict: "E",
            templateUrl: "javascripts/app/directives/templates/coinSideNav.html",
            link: function(scope, el) {
                // This is lazy... but, it works for now
                var page = document.location.hash.replace("#/", ""),
                    $link = el.find("a[href*='" + page + "']");
                
                if ($link.length) {
                    el.find("li").removeClass("active");
                    $link.closest("li").addClass("active");
                }

                el.on("click", "li",function(event) {
                    el.find("li").removeClass("active");

                    $(event.currentTarget).addClass("active");
                });
            }
        };
    }

    return directives.directive("coinSideNav", CoinSideNav);
});