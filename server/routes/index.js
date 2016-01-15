
/*
 * GET home page.
 */
var oa = require('../utils/oauth'),
    User = require('../db/models/user'),
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

            User.findOne({ 
                'yahoo_id': req.session.xoauthYahooGuid 
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        yahoo_id: req.session.xoauthYahooGuid,
                        displayAge: data.displayAge,
                        gender: data.gender,
                        imageUrl: data.image.imageUrl,
                        location: data.location,
                        nickname: data.nickname,
                        profileUrl: data.profileUrl
                    });
                }
                else {
                    user.displayAge = data.displayAge;
                    user.gender = data.gender;
                    user.imageUrl = data.image.imageUrl;
                    user.location = data.location;
                    user.nickname = data.nickname;
                    user.profileUrl = data.profileUr;
                }

                user.save(function(err) {
                    var u = user.toObject();
                    
                    delete u._id;
                    delete u._v;

                    if (err) throw err;

                    res.render('index', { 
                        title: 'Express',
                        user: JSON.stringify(u)
                    });
                });
            });
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