var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');


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
                
                var filledFormIds = req.user.filled_forms;

                for(var i=0; i<filledFormIds.length; ++i){
                    for(var j=0; j<forms.length; ++j){
                        if(forms[j]._id == filledFormIds[i]){
                        
                            // console.log("Matched form is:" + forms[j]._id)
                            forms.splice(j, 1);
                        }
                        
                    }
                }

                // GET responses data in order to find number of users filled form and ave time

                request('http://localhost:3000/responses_new/', function (error, response, body) {

                    var responses = JSON.parse(body);

                    forms.forEach(function (form) {
                        var formId = form._id;
                        form.noOfUsers = 0;
                        var noOfQuestions = form.mcq.length;
                        form.estimatedTime = 0;
                        responses.forEach(function (response) {
                            if(response.reviewId == formId){
                                console.log(formId);
                                form.noOfUsers += 1;

                                response.mcqResponse.forEach(function(singleResponse){
                                    form.estimatedTime += singleResponse.timeSpent;
                                })
                            }
                        });
                        form.estimatedTime = (form.estimatedTime/form.noOfUsers)/1000;
                    });

                    console.log("Forms:", forms);
                    res.render("landing", {forms: forms});
                });
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

            // New user registered
            // So push user data to API
            var userData = {username: req.body.username,
                roll_number:req.body.roll_number,
                email: req.body.email,
                full_name: req.body.full_name};
            
            console.log("data to push:", userData);

            request.post(
                'http://localhost:3000/users',
                { json: userData },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                        res.redirect("/");
                    } else if(error) {
                        console.log(error);
                    }
                }
            );
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

router.get("/feedback/:id", function (req, res) {
    res.render("feedback_form", {feedback_form_id: req.params.id});
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
            console.log("saved");
            res.send("ok");
        });
    });
});



module.exports = router;
