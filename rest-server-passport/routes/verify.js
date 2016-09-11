var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

// SEND TOKEN TO VALIDATED USER

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

// VERIFY AN ORDINARY USER


exports.verifyOrdinaryUser = function (req, res, next) {

    // CHECK HEADER OR URL PARAMS OR POST PARAMS FOR TOKENS
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // DECODE TOKEN

    if (token) {
        // VERIFY SECRET AND CHECK EXPIRY
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var error = new Error('You are not authenticated');
                error.status = 401;
                return next(error);
            }
            else {
                // IF EVERYTHING IS GOOD SAVE TO REQUEST OBJECT FOR USE IN OTHER ROUTES
                req.decoded = decoded;
                next()
            }
        });
    }
    else {
        // IF THERE IS NO TOKEN RETURN AN ERROR
        var err = new Error('No token provided');
        err.status = 403;
        return next(err);
    }
};

