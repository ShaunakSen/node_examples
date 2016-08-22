var http = require('http');
var hostname = 'localhost';
var port = 8080;

var server = http.createServer(function (req, res) {
    console.log(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h4>Hello World</h4>');

});

server.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});
