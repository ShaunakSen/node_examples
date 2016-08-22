Node Modules
_________________

We have this code in simplerect.js
var rect = {
    perimeter: function (x, y) {
        return (2 * (x + y));
    },
    area: function (x, y) {
        return (x * y);
    }
};

function solveRect(l, b) {
    console.log("Solving for rectangle with l=" + l + " and b=" + b);
    if (l < 0 || b < 0) {
        console.log("Rect dimensions should be greater than 0");
    }
    else {
        console.log("Area is " + rect.area(l, b));
        console.log("Perimeter is " + rect.perimeter(l, b));
    }
}

solveRect(2, 5);
solveRect(3, 4);
solveRect(-5, 4);


We want to create own module

Create new file rectangle-1.js

exports.perimeter = function (x, y) {
    return (2 * (x + y));
};

exports.area = function (x, y) {
    return (x * y);
};

In solve-1.js:

var rect = require('./rectangle-1');

function solveRect(l, b) {
......
......
}

Node Modules: Callbacks and Error Handling
__________________________________________________


2 Features of JS
__________________

First Class Functions: A function can be treated in same way as any other var
Closures: A function defined inside another function has access to all the vars declared in
          outer function or passed in as parameters(outer scope)
          The inner function will continue to have access to the vars from outer scope even
          after the outer function has returned


Callback is the piece of code that needs to run after a long running process is completed

Rectangle Module:

module.exports = function(x, y, callback){
try{
        if(x<0||t<0){
        throw new Error("....");
        }
    }
else{
        callback(null, {
        perimeter: function(){return (2*(x+y));},
        area: function(){return (x*y);}
        });
    }
catch (error){callback(error, null);}
}

This callback function will be called upon completion of the work
By convention, 1st parameter for callback function is an error

If no error occurs 1st param of callback is null
2nd param returns value that module is expected to return. Here it is a js object

Note perimeter() and area() do not take params as those params came in when rectangle module was called
This is due to closures


How do we use this module?

Calling the function:
rect(l, b, function(err, rectangle){
if(err){
        console.log(err);
    }
else{
        ...
    }
})

More on Node Modules:
1.File based Node modules
2.Core Modules
3.External Modules

Using ext node module:

use yargs node module
it supports command line args

eg: node solve-3 --l=2 --b=4

npm install yargs --save

--save to save dependencies in package.json file

Now there is a new folder automatically added called node_modules
there is yargs folder inside node_modules


The HTTP Protocol
___________________________

It is a client-server communication protocol used to retrieve hypertext documents

Request format:
Request Line
Header Fields
Blank Line
Body(HTML,TXT,JSON,XML, encode image/video etc)

Full Request Msg eg:
GET /index.html HTTP/1.1
____________________________
host:localhost:3000
connection: keep-alive
user-agent: Mozilla/5.0
accept-encoding: gzip, deflate, sdch
_____________________________________
Blank Line
_________________________________
Empty Body
________________________________


Response Format:
Status Line
___________
Headers
___________
Blank Line
___________
Response Data
___________

HTTP Request Msg Eg:
HTTP/1.1 200 OK
______________________
Connection:keep-alive
Content-Type: text/html
Date: Sun, 21 Feb 2016 06:01:43 GMT
Transfer Encoding: chunked
_____________________________
Blank Line
____________________________
<html>...</html>
__________________________


Path Module:
Path module constructs path based on OS

Windows:\
OSx or Linux: /
path.resolve('./public' + fileUrl) .. Gives absolute path
path.extname(filePath)..returns extension name

fs Module:
fs.exists(filePath, function(exists){...})
2nd param is a callback function
if file exists, var exists=true, else false

fs.createReadStream(filePath).pipe(res);

Creating Simple Server

node-examples
->node-http
  ->public


Create file in node-http as server-1.js

var http = require('http');
var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function (req, res) {
    console.log(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello World</h1>');
});

server.listen(port, hostname, function () {
    console.log("Server Running");
});


Start server

Go to localhost:3000
Hello World will be displayed there

We can use sudo curl http://localhost:3000 to access the server too
Or we can use POSTMAN too


Now we want to extend our server to return HTML files from public directory
var fs = require('fs');
var path = require('path');

If server receives GET request then a response is returned
Else it wont handle it









