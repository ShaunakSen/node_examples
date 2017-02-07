var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var cors = require('cors');

// TODO: require routes

var reviewRoute = require('./routes/reviews');
var responseRoute = require('./routes/responses');



var app = express();

mongoose.connect("mongodb://localhost:27017/conFusion");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected correctly to server');
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


// use the routes

app.use(reviewRoute);
// app.use(responseRoute);

// Start server

app.listen(3000, function () {
    console.log("REST API has Started!!");
});