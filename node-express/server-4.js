var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all(function (req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get(function (req, res, next) {
        res.end("Will send all the dishes to u!!");
    })
    .post(function (req, res, next) {
        res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function (req, res, next) {
        res.end("Deleting all the dishes!!");
    });

dishRouter.route('/:dishId')
    .all(function (req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get(function (req, res, next) {
        res.end("Will send details of dish with id: " + req.params.dishId + " to you!!");
    })
    .put(function (req, res, next){
        res.write("Updating dish with id: " + req.params.dishId);
        res.end("Will update the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function (req, res, next) {
        res.end("Deleting the dish with id: " + req.params.dishId);
    });

app.use('/dishes', dishRouter);

// SERVING STATIC FILES
app.use(express.static(__dirname + '/public/'));

app.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});
