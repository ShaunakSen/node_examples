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

Read server-2.js and understand the code


Express js
______________________________________________

It is a fast, unopinionated, minimalistic web framework for node

Express has lots of middlewares which provides a lot of functionalities

eg: morgan for logging info from server side
var morgan = require('morgan')
app.use(morgan('dev'))

Serving static web resources: use middleware static (included in express)

app.use(express.static(__dirname + '/public/'));

In node __filename and __dirname gives us full path to the file and directory of the current module


Create folder node-express

copy public folder from node-http folder here
create file server-1.js

in the folder node-express

run sudo npm init.. this creates package.json file

then run sudo npm install express --save

In server-1.js:
var express = require('express'), http = require('http');

var hostname = 'localhost';
var port = 8080;

var app = express();

Now use app.use() function to create a middleware

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

Now use POSTMAN to send GET requests to this server

Here whatever be url : say http://localhost:8080/sadada.dfgd

It returns the same response as it is coded that way only

Now we want to use morgan

In server-2.js

var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(morgan('dev'));

// SERVING STATIC FILES
app.use(express.static(__dirname + '/public/'));

app.listen(port, hostname, function () {
    console.log("Server Running at http://" + hostname + ":" + port);
});


REST
__________________________

Web Services
_________________

A system designed to support interoperability of systems connected across a n/w
Someone provides a service, somebody else consumes the service
A standardized way for exchange of information

2 approaches

1. SOAP (Simple Object Access Protocol)
   Uses WSDL (Web Services Description Language)
   Uses XML
2. REST (Representational State Transfer)
   Uses Web standards
   Uses either XML or JSON
   Simpler


REST takes a lot of stuff from HTTP
Now what made HTTP so successful was hyperlinks. u click on a link to get another resource

REST does something similar as:
1. URI (Uniform Resource Identifier) simar to URL
2. Uses HTTP Protocol
3. Make a request -> Receive response -> Display response

REST makes use of all the diff methods that HTTP provides
POST, GET, PUT, DELETE

REST Grammar
_______________________

Nouns - Resources: addressed using URI
eg: http://www.conFusion.food/dishes/123

Verbs - GET(Read), POST(Create), PUT(Update), DELETE(Delete)

Representations - XML and JSON


Express Router
____________________________

methods: app.all, app.get, app.post, app.put, app.delete

eg:
app.all('/dishes', function(req, res, next)
{
    ...
});

app.all means if u encounter any of the 4 kinds of requests for this particular URI, then apply the
particular function specified

Routes with params:

app.get('/dishes/:dishId', function(req, res, next){
    res.end("Will send u details of the dish: " + req.params.dishId);
});


Exercise
___________________

Setting up a REST API

Copy node_express/server-2.js into a new file server-3.js

We want to set up our express app to serve up our data in form of a REST API

When a client is communicating with server, client may send data to server in body of msg
which will be received as request msg on server side
This data is in JSON

When data gets to server side we want this data to be parsed and converted to a format which is
easier to use in js code in server side

To do this we use middleware body-parser

body-parser parses the data and converts it to js objects

var bodyParser = require('body-parser');

also install body-parser

app.use(bodyParser.json());

body-parser also parses other kinds of data for eg if we encode form data and send it, that can also be parsed

app.all('/dishes', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
});

next()->we want to continue processing with the remaining middlewares



app.all('/dishes', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
});
app.get('/dishes', function (req, res, next) {
    res.end("Will send all the dishes to u !!");
});
app.post('/dishes', function (req, res, next) {
    res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
});
app.delete('/dishes', function (req, res, next) {
    res.end("Deleting all the dishes!!");
});
app.get('/dishes/:dishId', function (req, res, next) {
    res.end("Will send details of dish with id: " + req.params.dishId + " to you!!");
});
app.put('/dishes/:dishId', function (req, res, next) {
    res.write("Updating dish with id: " + req.params.dishId);
    res.end("Will update the dish: " + req.body.name + " with details: " + req.body.description);
});
app.delete('/dishes/:dishId', function (req, res, next) {
    res.end("Deleting the dish with id: " + req.params.dishId);
});


Alternative approach
______________________

create server-4.js

We saw earlier that for each get,post,put,delete we had explicitly specified the url. But the chance
of making mistakes in that case is very high

Soln: use Express Router

var dishRouter = express.router();
dishRouter.use(bodyParser('json'));

Think of this dishRouter as a mini express application

so it supports all methods like use, get, put, post etc

Also it supports another method called route

dishRouter.route('/')
    .all(function (req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get(function (req, res, next) {
        res.end("Will send all the dishes to u!!");
    })
    .post(function (req, res, next) {
        res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function (req, res, next) {
        res.end("Deleting all the dishes!!");
    });


I am supporting get, post and delete on this route

dishRouter.route('/:dishId')
    .all(function (req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get(function (req, res, next) {
        res.end("Will send details of dish with id: " + req.params.dishId + " to you!!");
    })
    .put(function (req, res, next){
        res.write("Updating dish with id: " + req.params.dishId);
        res.end("Will update the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function (req, res, next) {
        res.end("Deleting the dish with id: " + req.params.dishId);
    });

Having coded the routes attach the dishRouter to the app

app.use('/dishes', dishRouter);


Express Generator
___________________________


Helps us to scaffold out an entire Express application

sudo npm install express-generator -g

express is now like a command available on terminal Windows

express <App name> : Generates this app

We want to use this express generator to build the REST API which we had built earlier

express node-express-gen

A new folder node-express-gen is created
Go into that folder->package.json
It shows dependencies => we need to do npm install

Go to app.js file
This looks like a typical express application which we have seen earlier

there are lots of require statements for various node modules

2 extra modules are: serve-favicon and cookie-parser

var routes = require('./routes/index');
var users = require('./routes/users');

This means we are requiring a file based node module that exists in routes folder

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

This is the view engine set up

app.use('/', routes);
app.use('/users', users);

Any request ending with '/' will be handled by routes module ie /routes/index.js file will
handle that

module.exports = app;

This module is used by /bin/www
In /bin/www we have:

var app = require('../app');
So the app in app.js module is used here

In package.json also:
"start": "node ./bin/www"

so this is the starting point

In views there exists the jade templates
Now go to routes/index.js

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

This is same router code which we did before

Go to node-express-gen folder and run sudo npm install to install dependencies

Next run npm start to start server

Use POSTMAN to send request to localhost:3000
A welcome msg Express Welcome to Express is generated
This msg is generated using index.jade file

Now we want to use this to implement dishRouter, leaderRouter and promoRouter
Copy those files into the routes folder

Also from public folder copy aboutus and index HTML files into public folder of node-express-gen

So these files will be served up by express app

Fixing app.js to use these new routers

Requiring the routers:
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

Mounting the routers:
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leadership', leaderRouter);





