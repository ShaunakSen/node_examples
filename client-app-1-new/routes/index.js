var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get("/", function (req, res) {
    res.render("landing");
});


router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username, roll_number:req.body.roll_number, email: req.body.email, full_name: req.body.full_name});
    User.register(newUser, req.body.password, function (err, user) {
        // user is newly created user
        if (err) {
            console.log(err);
            return res.render("landing");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});


module.exports = router;
