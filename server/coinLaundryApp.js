'use strict';

var routes = require('./routes'),
    user = require('./routes/user'),
    admin = require('./routes/admin'),
    api = require('./routes/api'),
    _ = require('underscore'),
    oa = require('./utils/oauth');

function FantasyApp(app, db) {
    this.app = app;
    this.db = db;

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
    
    // Admin Routes
    this.app.get('/api/admin/authenticate/:id', admin.isAdmin);
    this.app.get('/api/admin/create/:id', admin.createAdmin);

    // API Routes
    this.app.get('/api/users', user.list);
    _.each(api, function(route, name) {
        _.each(route, function(fn, verb) {
            this.app[verb]('/api/' + name, fn);
        }, this);
    }, this);
};

module.exports = FantasyApp;