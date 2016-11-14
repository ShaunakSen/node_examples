var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Responses = require('../models/responses');
var Verify = require('./verify');

var responseRouter = express.Router();
responseRouter.use(bodyParser.json());
responseRouter.route('/')
    .get(function (req, res) {
        console.log(req.decoded);
        Responses.find({})
            .exec(function (err, response) {
                if (err) throw err;
                res.json(response);
            })
    })
    .post(function (req, res) {
        // res.end("Will add the dish with name: " + req.body.name + " with details: " + req.body.description);

        Responses.create(req.body, function (err, response) {
            if (err) throw err;
            console.log('Response created');
            var id = response._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added the response with id: ', id);
        });
    });
/*
reviewRouter.route('/:reviewId/mcq')
    .get(function (req, res) {
        Reviews.findById(req.params.reviewId, function (err, review) {
            if(err){
                throw err;
            }
            res.json(review.mcq);
        });
    })
    .post(function (req, res) {
        Reviews.findById(req.params.reviewId, function (err, review) {
            if (err) throw err;

            review.mcq.push(req.body);

            review.save(function (err, review) {
                if (err) throw err;
                console.log('Updated review mcq!!');
                res.json(review);
            })
        });
    });
*/

module.exports = responseRouter;