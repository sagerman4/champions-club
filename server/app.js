'use strict';

var routes = require('./routes'),
    api = require('./routes/api'),
    _ = require('underscore');

function FantasyApp(app) {
    this.app = app;

    this.initialize();
}

FantasyApp.prototype.initialize = function() {
    this.setupRoutes();
};

FantasyApp.prototype.setupRoutes = function() {
    this.app.get('/', routes.index);
    this.app.get('/oauth', routes.oauth);
    this.app.get('/logout', routes.logout);
    this.app.get('/authorize', routes.authorize);
    
    _.each(api, function(route, name) {
        _.each(route, function(fn, verb) {
            this.app[verb]('/api/' + name, fn);
        }, this);
    }, this);
};

module.exports = FantasyApp;