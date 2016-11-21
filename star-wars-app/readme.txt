In app.js we have:

app.get('/', function (req, res) {

    // We are rendering the home template here
    // By default express looks in views/ for template
    // Also we do not need to specify the extension: .ejs
    res.render('home', {
        title: "Star Wars Movies"
    });
    // Here we are passing info from our route
});

We want to create a separate file for such callback functions as written above

For that we create file index.js in routes/

In index.js:

exports.home = function(req, res){
    res.render('home', {
            title: "Star Wars Movies"
        });
});

And in app.js:

var routes = require('./routes');

// HOME ROUTE

app.get('/', routes.home);

Similarly for the rest...

