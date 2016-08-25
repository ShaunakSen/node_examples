console.log("In Module dishRouter");

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 8080;

var app = express();
app.use(morgan('dev'));


exports.startServer = function () {
    var dishRouter = express.Router();
    dishRouter.use(bodyParser.json());
    dishRouter.route('/')
        .all(function (req, res, next) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            next();
        })
        .get(function (req, res, next) {
            res.end("Sending all the dishes to u!!")
        });
    app.use('/dishes', dishRouter);
    // SERVING STATIC FILES
    app.use(express.static(__dirname + '/public/'));

    app.listen(port, hostname, function () {
        console.log("Server Running at http://" + hostname + ":" + port);
    });
};