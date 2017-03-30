/**
 * Created by shaunak on 8/2/17.
 */
var express = require("express");
var Responses = require("../models/responses_new");
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

// GET ALL RESPONSES
router.get("/responses_new", function (req, res) {
    Responses.find({}, function (err, foundResponses) {
        if(err){
            console.log(err);
        } else {
            res.json(foundResponses);
        }
    })
});

// POST RESPONSES

router.post("/responses_new", function (req, res) {
    Responses.create(req.body, function (err, createdResponse) {
        if(err){
            console.log(err);
        } else {
            console.log("Created a responses with id: " + createdResponse._id);
            res.json(createdResponse);
        }
    });
});

// GET RESPONSE BY ID

router.get("/responses_new/:id", function (req, res) {
    var id = req.params.id;
    Responses.findById(id, function (err, foundResponse) {
        if(err){
            console.log(err);
        } else {
            res.json(foundResponse);
        }
    });
});

router.get("/responses_new/reviewId/:reviewId", function (req, res) {
    var reviewId = req.params.reviewId;
    Responses.find({reviewId: reviewId}, function (err, foundResponse) {
        if(err){
            console.log(err);
        } else {
            res.json(foundResponse);
        }
    });
});

// POST mcq response

router.post("/responses_new/:id/mcqResponse", function (req, res) {
    Responses.findById(req.params.id, function (err, foundResponse) {
        if(err){
            console.log(err);
        } else {
            foundResponse.mcqResponse.push(req.body);

            foundResponse.save(function (err, response) {
                if(err){
                    console.log(err);
                } else {
                    res.json(response);
                }
            });
        }
    });
});

module.exports = router;
