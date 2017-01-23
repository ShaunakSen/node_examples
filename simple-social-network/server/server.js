var express = require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');
var path = require("path");

var app = express();

mongoose.connect("mongodb://localhost:27017/time-waste");

app.use("/app", express.static(__dirname + "/app"));
console.log(__dirname);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

app.listen('3000', function () {
    console.log("Server started");
});