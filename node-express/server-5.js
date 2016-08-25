var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 8080;

var app = express();
app.use(morgan('dev'));

var dishRouter = require('./dishRouter');
var promoRouter = require('./promoRouter');
var leaderRouter = require('./leaderRouter');
dishRouter.startDishServer(express, bodyParser, app, hostname, port);
leaderRouter.startLeaderServer(express, bodyParser, app, hostname, port);
promoRouter.startPromotionServer(express, bodyParser, app, hostname, port);

app.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});