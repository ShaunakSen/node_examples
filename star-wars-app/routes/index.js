// Requiring the data

var moviesJSON = require('../movies.json');

exports.home = function (req, res) {

    // We are rendering the home template here
    // By default express looks in views/ for template
    // Also we do not need to specify the extension: .ejs


    var movies = moviesJSON.movies;

    res.render('home', {
        title: "Star Wars Movies",
        movies: movies
    });
    // Here we are passing info from our route
};

// movie_single

exports.movie_single = function (req, res) {

    var movies = moviesJSON.movies;

    var episode_number = req.params.episode_number;

    if (episode_number >= 1 && episode_number <= 6) {
        var movie = movies[episode_number - 1];

        var title = movie.title;

        var main_characters = movie.main_characters;

        res.render('movie_single', {
            movies: movies,
            title: title,
            movie: movie,
            main_characters: main_characters
        });
    }
    else {
        // Render 404 template
        res.render('notFound', {
            movies: movies,
            title: "This is not the page you are looking for"
        });
    }


};

// NOT FOUND
exports.notFound = function (req, res) {
    var movies = moviesJSON.movies;
    res.render('notFound', {
        movies: movies,
        title: "This is not the page you are looking for"
    });
};

// Note the sequence of route '*'.. Actually the route functions run in sequential order

// This is the basic characteristics of express middlewares

