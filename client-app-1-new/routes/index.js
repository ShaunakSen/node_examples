var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var bodyParser = require('body-parser');
var request = require('request');

router.use(bodyParser.json());

router.get("/", function (req, res) {

    
    if(req.user){

        // get dept of user
        var dept = req.user.roll_number.slice(3,5).toLowerCase();
        console.log(dept);

        // trigger API request to fetch related forms

        request('http://localhost:3000/reviews/target/' + dept, function (error, response, body) {
            if(error){
                console.log(error)
            } else {
                console.log(response.body);

                var forms = JSON.parse(body);


                
                // TODO: filter forms based on filled_forms data

                res.render("landing", {forms: forms});
            }
        })
    } else {
        res.render("landing", {forms: null});
    }
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

router.get("/users", function (req, res) {
    User.find({}, function (err, foundUsers) {
        if(err){
            console.log(err);
        } else {
            res.json(foundUsers);
        }
    })
});


router.put("/users/:userId/filled_forms", function (req, res) {
    console.log("From PUT route", req.body);
    User.findById(req.params.userId, function (err, user) {
        if(err){
            console.log(err);
        }

        // check if review_id already exists

        var toAdd = true;

        for(var i = 0; i< user.filled_forms.length; ++i){
            if(user.filled_forms[i] == req.body.review_id){
                toAdd = false;
            }
        }
        if(toAdd == true){
            user.filled_forms.push(req.body.review_id);
        }
        user.save(function (err, user) {
            if (err) throw err;
        });
    });
});



module.exports = router;
