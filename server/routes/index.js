
/*
 * GET home page.
 */
var User = require('../db/models/user'),
    _ = require('underscore'),
    FantasySports = require('FantasySports');

FantasySports.options(require('../config.js'));

exports.index = function(req, res) {
    if (!req.session.oauthAccessToken) {
        return res.redirect('/oauth');
    }

    FantasySports.
        request(req, res)
        .api('https://social.yahooapis.com/v1/user/' + req.session.xoauthYahooGuid + '/profile/usercard?format=json')
        .done(function(data) {
            data = data.profile;

            
            res.redirect('/index.html');
        });
};  

exports.oauth = function(req, res) {
    FantasySports.startAuth(req, res);
};

exports.authorize = function(req, res) {
    FantasySports.endAuth(req, res);
};

exports.logout = function(req, res) {
    req.session = {};

    res.redirect('/');
};