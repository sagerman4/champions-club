define(function (require) {
    var services = require("services/services");

    function User() {
        return window.yahoo_user;
    }

    return services.factory("User", User);
});