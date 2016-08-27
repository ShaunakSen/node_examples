var express = require('express');
var bodyParser = require('body-parser');


var promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
    .all(function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        next();
    })
    .get(function (req, res, next) {
        res.end("Sending all the promotions to u!!")
    })
    .delete(function (req, res, next) {
        res.end("Deleting all the promotions!!");
    })
    .post(function (req, res, next) {
        res.end("Will add the promotion with name: " + req.body.name + " with details: " + req.body.description);
    });
promoRouter.route('/:promotionId')
    .all(function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        next();
    })
    .get(function (req, res, next) {
        res.end("Sending the promotion with id: " + req.params.promotionId);
    })
    .delete(function (req, res, next) {
        res.end("Deleting the promotion with id: " + req.params.promotionId);
    })
    .put(function (req, res, next) {
        res.write("Updating promotion with id: " + req.params.promotionId);
        res.end("\nWill update the promotion with name: " + req.body.name + " with details: " + req.body.description);
    });


module.exports = promoRouter;