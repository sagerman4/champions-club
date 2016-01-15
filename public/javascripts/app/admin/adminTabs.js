define(function(require) {
    var admin = require("admin/adminModule");

    function AdminTabs() {
        return {
            restrict: "E",
            templateUrl: "javascripts/app/admin/templates/adminTabs.html",
            link: function(scope, el) {
                el.find("a[data-target=\"#" + scope.activeTab + "\"]").tab("show");
            }
        };
    }

    return admin.directive("adminTabs", AdminTabs);
});
