var express = require('express');

var app = express();

// app now has all methods of express

// Setting our view engine

app.set('view engine', 'ejs');

var routes = require('./routes');

// Specify directory of static assets

var path = require('path');

// This tells express that static assets are in the public path directory

app.use(express.static(path.join(__dirname, 'public')));

// Specifying our routes

// Routes -> binding certain functionality when user requests certain address

// HOME ROUTE

app.get('/', routes.home);

// movie_single

app.get('/star_wars_episode/:episode_number?', routes.movie_single);

// NOT FOUND
app.get('*', routes.notFound);

// Note the sequence of route '*'.. Actually the route functions run in sequential order

// This is the basic characteristics of express middlewares


app.listen(3000, function () {
    console.log("The app is running on localhost:3000");
});