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
responseRouter.route('/:responseId/mcqResponse')
    .get(function (req, res) {
        Responses.findById(req.params.responseId, function (err, response) {
            if (err) {
                throw err;
            }
            res.json(response.mcqResponse);
        });
    })
    .post(function (req, res) {
        Responses.findById(req.params.responseId, function (err, response) {
            if (err) throw err;

            response.mcqResponse.push(req.body);

            response.save(function (err, response) {
                if (err) throw err;
                console.log('Updated response!!');
                res.json(response);
            })
        });
    })
    .delete(function (req, res, next) {
        // res.end("Deleting the dish with id: " + req.params.dishId);
        Responses.findByIdAndRemove(req.params.responseId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = responseRouter;