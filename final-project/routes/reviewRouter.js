var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Reviews = require('../models/reviews');
var Verify = require('./verify');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());
reviewRouter.route('/')
    .get(function (req, res) {
        console.log(req.decoded);
        Reviews.find({})
            .exec(function (err, review) {
                if (err) throw err;
                res.json(review);
            })
    })
    .post(function (req, res) {
        // res.end("Will add the dish with name: " + req.body.name + " with details: " + req.body.description);

        Reviews.create(req.body, function (err, review) {
            if (err) throw err;
            console.log('Review created');
            var id = review._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added the review with id: ', id);
        });
    });

module.exports = reviewRouter;