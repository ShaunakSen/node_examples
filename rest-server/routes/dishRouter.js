var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Dishes = require('../models/dishes');


var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .get(function (req, res, next) {
        Dishes.find({}, function (err, dish) {
            if(err) throw err;
            res.json(dish);
        });
    })
    .delete(function (req, res, next) {
        res.end("Deleting all the dishes!!");
    })
    .post(function (req, res, next) {
        // res.end("Will add the dish with name: " + req.body.name + " with details: " + req.body.description);

        Dishes.create(req.body, function (err, dish) {
            if(err) throw err;
            console.log('Dish created');
            var id = dish._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added the dish with id: ', id);
        });
    });
dishRouter.route('/:dishId')
    .all(function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        next();
    })
    .get(function (req, res, next) {
        res.end("Sending the dish with id: " + req.params.dishId);
    })
    .delete(function (req, res, next) {
        res.end("Deleting the dish with id: " + req.params.dishId);
    })
    .put(function (req, res, next) {
        res.write("Updating dish with id: " + req.params.dishId);
        res.end("\nWill update the dish with name: " + req.body.name + " with details: " + req.body.description);
    });

module.exports = dishRouter;