define(function (require) {
    var directives = require("directives/directives"),
        markdown = require("markdown");

    function CoinMd() {
        return {
            restrict: "AE",
            link: function(scope, el) {
                var text = el.text(),
                    html = markdown.toHTML(text);
                
                el.html(html);
            }
        }
    }

    return directives.directive("coinMd", CoinMd);
});