var http = require('http');
var fs = require('fs');
var path = require('path');
var hostname = 'localhost';
var port = 8080;
var server = http.createServer(function (req, res) {
    console.log("Request for " + req.url + " by method " + req.method);
    if (req.method == "GET") {
        var fileUrl;
        if (req.url == '/')
            fileUrl = '/index.html';
        else
            fileUrl = req.url;
        var filePath = path.resolve('./public' + fileUrl);
        var fileExt = path.extname(filePath);
        if (fileExt == ".html") {
            fs.exists(filePath, function (exists) {
                if (!exists) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h4>Oops..ERROR 404 ' + fileUrl + ' not found </h4>');
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    fs.createReadStream(filePath).pipe(res);
                }
            });
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h4>Oops..ERROR 404 ' + fileUrl + ' is not HTML file</h4>');
        }
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h4>Oops..ERROR 404 ' + req.method + ' is not supported</h4>');
    }

});

server.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});
