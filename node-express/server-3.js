var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());


app.all('/dishes', function (req, res, next) {
    res.writeHead()
})

// SERVING STATIC FILES
app.use(express.static(__dirname + '/public/'));

app.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});
