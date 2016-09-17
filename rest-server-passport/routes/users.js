var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    // res.send('respond with a resource');
    User.find({}, function (err, users) {
        res.json(users);
    });
});

// REGISTER

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }

        if(req.body.firstname){
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname){
            user.lastname = req.body.lastname;
        }

        user.save(function (err, user) {
            // CROSS CHECK IF REGISTRATION WAS SUCCESSFUL
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });


    });
});

// LOGIN

router.post('/login', function (req, res, next) {
    // req.body will contain username and password
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // IF USER IS NOT VALID OR WRONG PASSWORD OR DUPLICATE USER ETC
            return res.status(401).json({err: info});
        }
        // PASSPORT LOGIN METHOD
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({err: 'Could not log in user'});
            }

            // VALID USER
            console.log('User in users: ', user);

            // GENERATE TOKEN
            var token = Verify.getToken(user); // RETURNS A TOKEN

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        })
    })(req, res, next);
});

// LOGOUT

router.get('/logout', function (req, res) {
    req.logout(); // PASSPORT METHOD

    // ALSO TOKEN WILL BE DESTROYED HERE

    res.status(200).json({status: 'Bye!'});
});

module.exports = router;
