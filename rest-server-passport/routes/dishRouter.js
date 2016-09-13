var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Dishes = require('../models/dishes');
var Verify = require('./verify');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res) {
        console.log(req.decoded);
        Dishes.find({}, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res) {
        // res.end("Deleting all the dishes!!");
        Dishes.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res) {
        // res.end("Will add the dish with name: " + req.body.name + " with details: " + req.body.description);

        Dishes.create(req.body, function (err, dish) {
            if (err) throw err;
            console.log('Dish created');
            var id = dish._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added the dish with id: ', id);
        });
    });
dishRouter.route('/:dishId')
    .get(function (req, res) {
        // res.end("Sending the dish with id: " + req.params.dishId);
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        })
    })
    .delete(function (req, res, next) {
        // res.end("Deleting the dish with id: " + req.params.dishId);
        Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
    .put(function (req, res) {
        /*res.write("Updating dish with id: " + req.params.dishId);
         res.end("\nWill update the dish with name: " + req.body.name + " with details: " + req.body.description);*/

        Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true}, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    });

// HANDLING COMMENTS
dishRouter.route('/:dishId/comments')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            res.json(dish.comments);
        });
    })
    .post(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            
            // REFERENCE TO USER 
            req.body.postedBy = req.decoded._doc._id;

            dish.comments.push(req.body);

            dish.save(function (err, dish) {
                if (err) throw err;
                console.log('Updated Comments!!');
                res.json(dish);
            })
        });
    })
    .delete(Verify.verifyAdmin, function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            for (var i = dish.comments.length; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Deleted all comments!!');
            });
        });
    });
// HANDLING SPECIFIC COMMENTS

dishRouter.route('/:dishId/comments/:commentId')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            res.json(dish.comments.id(req.params.commentId));
        });
    })
    .put(function (req, res) {
        //delete existing comment and insert updated comment as a new comment
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            console.log(dish.comments.id(req.params.commentId));
            dish.comments.id(req.params.commentId).remove();

            // REFERENCE TO USER
            req.body.postedBy = req.decoded._doc._id;
            dish.comments.push(req.body);

            dish.save(function (err, dish) {
                if (err) throw err;

                console.log('Updated Comments!!');
                res.json(dish);
            });
        });
    })
    .delete(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;

            // CHECK IF USER WHO CREATED COMMENT IS DELETING IT

            if(dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id){
                var error = new Error('You are not authorized to perform this operation!');
                error.status = 403;
                return next(error);
            }

            dish.comments.id(req.params.commentId).remove();

            dish.save(function (err, resp) {
                if (err) throw err;

                res.json(resp);
            });
        });
    });

module.exports = dishRouter;