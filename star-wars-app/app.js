var express = require('express');

var app = express();

// app now has all methods of express

// Specifying our routes

// Routes -> binding certain functionality when user requests certain address

// HOME ROUTE

app.get('/', function (req, res) {
   res.send("This is server's response on Home Page");
});

// movie_single

app.get('/star_wars_episode/:episode_number?', function (req, res) {
    var episode_number = req.params.episode_number;
    res.send("This is the page for episode " + episode_number);
});

// NOT FOUND
app.get('*', function (req, res) {
    res.send("This is not the page you are looking for");
});

// Note the sequence of route '*'.. Actually the route functions run in sequential order

// This is the basic characteristics of express middlewares




app.listen(3000, function () {
    console.log("The app is running on localhost:3000");
});