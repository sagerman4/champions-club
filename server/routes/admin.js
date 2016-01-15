var Admin = require("../db/models/admin"),
    User = require("../db/models/user"),
    _ = require("underscore");

exports.isAdmin = function(req, res) {
    Admin.find(function(err, users) {
        var isAdmin = _.any(users, function(user) {
            return user.yahoo_id === req.params.id;
        });
        
        res.send({
            success: true,
            data: isAdmin
        });
    });
};

exports.createAdmin = function(req, res) {
    Admin.findOne({
        yahoo_id: req.params.id
    }, function(err, user) {
        if (!user) {
            var admin = new Admin({
                yahoo_id: req.params.id
            });

            admin.save(function() {
                res.send({
                    success: true,
                    message: "Admin user created!"
                });
            });

            return;
        }

        res.send({
            success: true,
            message: "User was already an admin!"
        });
    });

    
};