// grab all packages


var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var congig = require('./config');
var User = require('./models/user');

// Configuration

var port = process.env.PORT || 8080;
mongoose.connect(congig.database);
app.set('superSecret', congig.secret);

// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));


// ROUTES


// basic route
app.get('/', function (req, res) {
    res.send("Hello.. The API is at http://localhost:" + port + "/api");
});

app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        name: 'Nick Cerminara',
        password: 'password',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});


// Start the server


app.listen(port);
console.log('Magic happens at http://localhost:' + port);











