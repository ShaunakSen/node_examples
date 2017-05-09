var express = require("express");
var Reviews = require("../models/reviews");
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

// GET ALL REVIEWS
router.get("/reviews", function (req, res) {
    Reviews.find({}, function (err, foundReviews) {
        if(err){
            console.log(err);
        } else {
            res.json(foundReviews);
        }
    })
});

// POST REVIEW
router.post("/reviews", function (req, res) {
    Reviews.create(req.body, function (err, createdReview) {
        if(err){
            console.log(err);
        } else {
            console.log("Created a review with id: " + createdReview._id);
            res.json(createdReview);
        }
    });
});

// GET REVIEW BY ID
router.get("/reviews/:id", function (req, res) {
    var id = req.params.id;
    Reviews.findById(id, function (err, foundReview) {
        if(err){
            console.log(err);
        } else {
            res.json(foundReview);
        }
    });
});
// GET REVIEW BY TARGETED USERS
router.get("/reviews/target/:target", function (req, res) {
    var target = req.params.target;
    if(target === "all"){
        target = "All";
    }
    Reviews.find({"targetedUsers": target}, function (err, foundReviews) {
        if(err){
            console.log(err);
        } else {
            res.json(foundReviews);
        }
    })
});


// POST mcq question

router.post("/reviews/:id/mcq", function (req, res) {
    Reviews.findById(req.params.id, function (err, foundReview) {
        if(err){
            console.log(err);
        } else {
            foundReview.mcq.push(req.body);

            foundReview.save(function (err, review) {
                if(err){
                    console.log(err);
                } else {
                    res.json(review);
                }
            });
        }
    });
});

module.exports = router;
