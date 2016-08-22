var express = require('express'), http = require('http');

var hostname = 'localhost';
var port = 8080;

var app = express();

// CREATE MIDDLEWARE
app.use(function (req, res, next) {
    console.log(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<html><body><h4>Hello Mini</h4></body></html>');
});

// CREATE SERVER
var server = http.createServer(app);
server.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});




