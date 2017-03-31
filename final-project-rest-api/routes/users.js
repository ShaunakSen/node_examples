/**
 * Created by shaunak on 8/2/17.
 */
var express = require("express");
var Users = require("../models/users");
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

// GET ALL RESPONSES
router.get("/users", function (req, res) {
    Users.find({}, function (err, foundUsers) {
        if(err){
            console.log(err);
        } else {
            res.json(foundUsers);
        }
    })
});

// POST RESPONSES

router.post("/users", function (req, res) {
    Users.create(req.body, function (err, createduser) {
        if(err){
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
        if(err){
            console.log(err);
        } else {
            res.json(fundUser);
        }
    });
});

// TODO: PUT rote for editing filled_forms


module.exports = router;
