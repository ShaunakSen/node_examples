var express = require('express');
var bodyParser = require('body-parser');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .all(function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        next();
    })
    .get(function (req, res, next) {
        res.end("Sending all the dishes to u!!")
    })
    .delete(function (req, res, next) {
        res.end("Deleting all the dishes!!");
    })
    .post(function (req, res, next) {
        res.end("Will add the dish with name: " + req.body.name + " with details: " + req.body.description);
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