/**
 * Created by shaunak on 8/2/17.
 */
var express = require("express");
var Users = require("../models/users");
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

// GET ALL USERS
router.get("/users", function (req, res) {
    Users.find({}, function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            res.json(foundUsers);
        }
    })
});

// POST USER

router.post("/users", function (req, res) {
    Users.create(req.body, function (err, createduser) {
        if (err) {
            console.log(err);
        } else {
            console.log("Created a user with id: " + createduser._id);
            res.json(createduser);
        }
    });
});

// GET USER BY ID

router.get("/users/:id", function (req, res) {
    var id = req.params.id;
    Users.findById(id, function (err, fundUser) {
        if (err) {
            console.log(err);
        } else {
            res.json(fundUser);
        }
    });
});

// GET NO OF FLAGS FOR USER BY _id

router.get("/users/:id/flagsbyid", function (req, res) {
    var id = req.params.id;

    var query = Users.findById(id).select('flags');
    query.exec(function (err, foundDoc) {
        if(err){
            console.log(err)
        } else {
            res.json(foundDoc);
        }
    })
});

router.get("/users/:username/flagsbyusername", function (req, res) {
    var username = req.params.username;

    var query = Users.find({username: username}).select('flags');
    query.exec(function (err, foundDoc) {
        if(err){
            console.log(err)
        } else {
            res.json(foundDoc);
        }
    })
});



// PUT rote for editing filled_forms


router.put("/users/:username/filled_forms", function (req, res) {
    var username = req.params.username;

    Users.find({username: username}, function (err, foundUsers) {
        if(err){
            console.log(err);
        } else {
            var foundUser = foundUsers[0];

            // check if review_id already exists

            var toAdd = true;

            if(typeof foundUser.filled_forms == "undefined"){
                foundUser.filled_forms = [];
            }


            for(var i = 0; i< foundUser.filled_forms.length; ++i){
                if(foundUser.filled_forms[i] == req.body.review_id){
                    toAdd = false;
                }
            }
            if(toAdd == true){
                foundUser.filled_forms.push(req.body.review_id);
            }
            foundUser.save(function (err, user) {
                if (err) throw err;
                res.json(user);
            });
        }
    })
});

// PUT Route for increasing flag for user


router.put("/users/:username/flags", function (req, res) {
    var username = req.params.username;

    Users.find({username: username}, function (err, foundUsers) {
        if(err){
            console.log(err);
        } else {
            var foundUser = foundUsers[0];
            console.log(foundUser);
            if(typeof foundUser.flags != "undefined"){
                console.log("I have a flag");
                var currentFlag = foundUser.flags;
                foundUser.flags = currentFlag + 1;
                foundUser.save(function (err, user) {
                    if(err){
                        console.log(err);
                    } else {
                        res.json(user);
                    }
                })
            } else {
                console.log("here");
                res.json({
                    message: "No flag data"
                });
            }
        }
    });
});






module.exports = router;
