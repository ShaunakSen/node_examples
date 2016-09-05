var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));

function auth(req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if(!authHeader){
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
    if(user == "admin" && pass == "password"){
        next();
    }
    else {
        var error = new Error('You are not authenticated!!');
        error.status = 401;
        next(error);
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
