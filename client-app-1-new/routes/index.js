var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get("/", function (req, res) {
    res.render("landing");
});


// TEST ROUTES

router.get("/success", function (req, res) {
    res.send("Success!!");
});

router.get("/failed", function (req, res) {
    res.send("Failure!!");
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

// handle login logic

// the middleware uses authenticate method which authenticates user..if it works it redirects somewhere else somewhere else

router.post("/login", passport.authenticate("local",
    {successRedirect: "/", failureRedirect: "/failed"}), function (req, res) {
});

// logout

router.get("/logout", function (req, res) {
    req.logout();
    // flash message

    // req.flash("success", "Logout successful");
    res.redirect("/");
});


router.get("/feedback", function (req, res) {
   res.render("feedback_form");
});


router.get("/test", function (req, res) {
    res.render("test", { gameState : "mini" });
});


module.exports = router;
