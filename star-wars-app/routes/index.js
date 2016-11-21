exports.home = function (req, res) {

    // We are rendering the home template here
    // By default express looks in views/ for template
    // Also we do not need to specify the extension: .ejs
    res.render('home', {
        title: "Star Wars Movies"
    });
    // Here we are passing info from our route
};

// movie_single

exports.movie_single = function (req, res) {
    var episode_number = req.params.episode_number;
    res.send("This is the page for episode " + episode_number);
};

// NOT FOUND
exports.notFound = function (req, res) {
    res.send("This is not the page you are looking for");
};

// Note the sequence of route '*'.. Actually the route functions run in sequential order

// This is the basic characteristics of express middlewares

