var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));

app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

function auth(req, res, next) {
    console.log(req.headers);

    // CHECK FOR SIGNED COOKIE
    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!!');
            err.status = 401;
            next(err);
            return;
        }
        var test = Buffer(authHeader.split(' ')[1], 'base64');
        console.log("Un encoded string is", test.toString());
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == "admin" && pass == "password") {
            req.session.user = 'admin';
            next();
        }
        else {
            var error = new Error('You are not authenticated!!');
            error.status = 401;
            next(error);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session:', req.session);
            next();
        }
        else {
            var err = new Error('You are not authenticated!!');
            err.status = 401;
            next(err);
        }
    }

}

app.use(auth);

// SERVING STATIC FILES
app.use(express.static(__dirname + '/public/'));

// ERROR HANDLER MIDDLEWARE

app.use(function (err, req, res, next) {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});
