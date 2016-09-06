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

Read server.js and understand the code


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

In server.js

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
1. URI (Uniform Resource Identifier) similar to URL
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

Copy node_express/server.js into a new file server-3.js

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


Introduction to MongoDB
_____________________________________________

MongoDB is a NoSQL Document Based Databse

Document: self-contained piece of information
eg: a JSON document: {"name":"...", "description": "......"}
Collection: Set of documents
Database: Set of collections

When u retrieve data from a Mongo Database u get back JSON document

Mongo stores data on disk in BSON (Binary JSON) format
- Supports length prefix on each value (so no need to scan entire field to know length)
- Info about type of field value
- Addnl primitive types like UTC date time, raw binary and ObjectId

ObjectId
__________
every doc in mongo must have _id field associated with it

Default ObjectId is created by MongoDB when we insert a document
eg:
{
    "_id":ObjectId("56ce76c0....."),
    "name":"...." 
}

ObjectId is a 12 byte field

TimeStamp(4)|Machine ID(3)|Proc. ID(2)|Increment(3)
Machine ID holds info regarding machine where Database is running
Process ID is mongo server's process ID
Increment - TimeStamp is at the resolution of a second. So within a second if multiple documents are stored,
Increment field tacks that information

id.getTimeStamp() returns the TimeStamp in ISO Date Format


Create folder mongodb in node-express-gen/
Create folder data in mongodb/

Open node-express-gen/mongodb/ in terminal
Run command: mongod --dbpath=data

Mongo runs on port 27017

use conFusion: creates new db conFusion

db.dishes.insert({name:"Uthapizza", description:"Awesome...!!"});

Here dishes is the Collection
db.dishes.find()
{ "_id" : ObjectId("57c2a018eb98020452a20465"), "name" : "Uthapizza", "description" : "Very nice" }
{ "_id" : ObjectId("57c3291bd5711a550dd8203f"), "name" : "Uthapizza", "description" : "Awesome...!!" }

 db.dishes.find().pretty()
{
        "_id" : ObjectId("57c2a018eb98020452a20465"),
        "name" : "Uthapizza",
        "description" : "Very nice"
}
{
        "_id" : ObjectId("57c3291bd5711a550dd8203f"),
        "name" : "Uthapizza",
        "description" : "Awesome...!!"
}

Note how _id gets inserted automatically

> var id = new ObjectId()
> id
ObjectId("57c33c7ad5711a550dd82040")
> id.getTimestamp()
ISODate("2016-08-28T19:33:14Z")

Node and Mongodb
_____________________________________

Node MongoDb Driver
-Provides high level API for Node app to interact with MongoDB Server
Also: Mongoose

npm install mongodb --save

Create new folder node-mongodb

sudo npm install mongodb --save in this folder
sudo npm install assert --save

A simple node-mongo app:
___________________________________


Create file simpleserver.js in node-mongodb

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
we are requiring MongoClient part of mongodb module

See simpleserver.js for full code

Now we want to create a separate module for db operations

Create file operations.js

var assert = require('assert');

exports.findDocuments = function (db, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);
    // FIND SOME DOCUMENTS
    coll.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    })
};

Note how db, collection and callback function are passed as params
So these functions would work for any db, any collection

exports.insertDocument = function (db, document, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);
    // INSERT SOME DOCUMENTS
    coll.insert(document, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted " + result.result.n + " documents into the documents collection " + collection);
        callback(result);
    });
};


exports.removeDocument = function (db, document, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);

    coll.deleteOne(document, function (err, result) {
        assert.equal(err, null);
        console.log("Removed The Document " + document);
        callback(result);
    });
};

removeDocument takes in document. This is not an entire document but a filter for identifying a document
coll.deleteOne(document, function (err, result) deletes first document in the collection
which matches the criteria


exports.updateDocument = function (db, document, update, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);

    coll.updateOne(document, {$set: update}, null, function(err, result){
        assert.equal(err, null);
        console.log("Updated document with " + update);
        callback(result);
    });
};

Update also takes in a filter i.e part of document

Create file server.js
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var dboper = require('./operations');

var url = 'mongodb://localhost:27017/conFusion';

MongoClient.connect(url, function (err, db) {
    assert.equal(err, null);
    console.log("Connected correctly to server");
});


Now first we want to insert... Insert also takes in a callback function as argument
In this callback function we want to find

See server.js

Note the chaining of callback  functions

Mongoose
______________________________________________


Mongo stores data in form of documents
No structure is imposed on any doc
Any doc can be stored in any collection
Relies on developer principles to maintain structure of documents

If we want to impose structure mongoose ODM is the soln

It adds structure to MongoDB documents through schema

Schema Types: String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array

Schema is used to create a Model function

Schema example:

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true}},
    {timestamps: true});

var dishes = mongoose.model('Dish', dishSchema);

In separate file:

var Dishes = require('./models/dishes')

var newDish = Dishes({name:"Uthapizza", description: "test"});
newDish.save(function(err){
    if(err) throw err;

    Dishes.find({}, function(err, dishes){
        if(err) throw err;
        console.log(dishes);
        ....
        ....
    })
})


{timestamps: true} adds 2 fields created_at and updated_at
These 2 fields stores info in form of date time
very useful for filtering and sorting

Here we specify model name: Dish and its schema as dishSchema

Mongo creates a collection.  The name of the collection will be the plural of model name
i.e dishes


Embedded Documents Schema
___________________________

Mongoose allows us to embed one or many docs inside another

These embedded docs are referred to as sub docs

var commentSchema = new Schema({
    rating: {type: Number, min:1, max:5, required:true},
    comment: {type: String, required: true},
    author: {type: String, required: true},
}, {timestamps: true});

var dishSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true}
    comments:[commentSchema] },         // ---- NOTE THIS LINE
    {timestamps: true});

var dishes = mongoose.model('Dish', dishSchema);

In mongoose when we insert a sub doc each sub doc also gets a MongoDB ID
So they can also be identified

In the earlier eg we created a doc and called save()

We can directly do create() on the model and pass the document in as a parameter

Dishes.create({
    name:"",
    description:"",
    comments: [
        {rating: 3, comment:"", author:"MINI"},
        {rating: 2, comment:"", author:"SHONA"}
    ]
}, function(err, dish){
    ...
})


Exercise Mongoose ODM
______________________________

Create folder in node-examples/ as node-mongoose

In terminal do sudo npm init

Now do npm install mongoose
npm install assert

Within folder node-mongoose create folder models
In models create file dishes-1.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// CREATE A SCHEMA

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
},{timestamps: true});

Create the model:
var Dishes = mongoose.model('Dish', dishSchema);

Since the first parameter of model is Dish Mongoose will create a collection
having name dishes i.e the plural of that

Finally:
module.exports = Dishes;

We now need to write a node module to make use of this schema


Create file server-1.js

var mongoose = require('mongoose'), assert = require('assert');

var Dishes = require('./models/dishes-1');

var url = 'mongodb://localhost:27017/conFusion';

mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected correctly to server');
});


db.once('open', function () {
    console.log('Connected correctly to server');

    // DO DB OPERATIONS HERE

    // CREATE DISH
    var newDish = Dishes({
        name: "Uthapizza",
        description: "Test"
    });

    // INSERT
    newDish.save(function (err) {
        if (err) throw err;
        console.log('Dish Created!!');

        // GET ALL DISHES
        Dishes.find({}, function (err, dishes) {
            if (err) throw err;
            console.log(dishes);

            db.collection('dishes').drop(function () {
                db.close();
            });
        });
    });
});

Create another file server.js

db.once('open', function () {
    console.log('Connected correctly to server');

    // CHANGE CODE HERE
});



db.once('open', function () {
    console.log('Connected correctly to server');
    Dishes.create({
        name: "UthaPizza",
        description: "Test"
    }, function (err, dish) {
        if (err) throw err;
        console.log(dish);
        // CAPTURE ID OF THE DISH
        var id = dish._id;
        //DELAY
        setTimeout(function () {
            Dishes.findByIdAndUpdate(id, {
                $set: {
                    description: "Updated Test"
                }
            }, {
                new: true
            })
                .exec(function (err, dish) {
                    if(err) throw err;
                    console.log("Updated Dish!!");
                    console.log(dish);

                    db.collection('dishes').drop(function () {
                        db.close();;
                    });
                });
        }, 3000);


    });

});

findByIdAndUpdate: this is method supported by mongoose

Then we introduce a delay. This is done so that there is a difference(3 secs) bw created_at
and updated_at fields

findByIdAndUpdate takes as first param the id of the dish which we have already found out

2nd param: what to update

3rd param: option specifying new:true
new: true => return the updated dish

.exec() -> executes the query

It takes callback as parameter

When we run this :
dish gets created ... 3 secs ... updated and updated dish is returned... collection is dropped


Sub Documents:
___________________

In models create dishes-2.js

We want to introduce comments as part of the dishes document

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {timestamps: true});


We have created comment schema. We now want to add it as a sub doc in dishes schema

comments: [commentSchema]

note: [] ensures that it accepts an array of objects each of which which satisfy commentSchema


Create a new server file i.e server-3.js

copy code from server-2

require dishes-2 module
var Dishes = require('./models/dishes-2');

Dishes.create({
        name: "UthaPizza",
        description: "Test"
        ...
})

Now i would like to insert a comment here as well

comments: [
            {
                rating: 3,
                comment: "Awesome Dish !!",
                author: "Budhhu Mini"
            }
        ]

Now we want to insert a new comment into an existing dish:

We can use push() method of mongoose for this


.exec(function (err, dish) {
                    if (err) throw err;
                    console.log("Updated Dish!!");
                    console.log(dish);

                    // UPDATING COMMENTS
                    dish.comments.push({
                        rating: 5,
                        comment: 'I\'m loving It!!',
                        author: "Shona"
                    });

                    dish.save(function (err, dish) {
                        console.log("Updated Comments !!");
                        console.log(dish);

                        // SET DATABASE TO PRISTINE CONDITION
                        db.collection('dishes').drop(function () {
                            db.close();
                        });
                    })


                });

Data:

{ __v: 0,
  updatedAt: Wed Aug 31 2016 01:38:19 GMT+0530 (IST),
  createdAt: Wed Aug 31 2016 01:38:19 GMT+0530 (IST),
  name: 'UthaPizza',
  description: 'Test',
  _id: 57c5e7b31bdb82f2261c3770,
  comments:
   [ { updatedAt: Wed Aug 31 2016 01:38:19 GMT+0530 (IST),
       createdAt: Wed Aug 31 2016 01:38:19 GMT+0530 (IST),
       rating: 3,
       comment: 'Awesome Dish !!',
       author: 'Budhhu Mini',
       _id: 57c5e7b31bdb82f2261c3771 } ] }

Note how each comment also has updatedAt and createdAt fields and each comment has its own _id field



REST API WITH EXPRESS, MONGO AND MONGOOSE
_________________________________________________________

Now we have built a REST API using Express
Also we have built a MongoDB database using mongoose

We have to combine these together to build a full fledged REST API

For eg GET operation on REST API would trigger a QUERY on Database
POST operation on REST API would trigger a CREATE on Database

Thus an HTTP request has to be mapped to Database Operation

Create a new Express app
run: express rest-server

A new Express app called rest-server is now created

We have already built express REST API.. We will use that code

Go to node-express-gen/
Copy app.js
replace app.js file in rest-server/

Next: copy in the routes we developed

Copy dishRouter, leaderRouter and promoRouter

Next: Setting up the Mongoose models

Copy models/ folder from node-mongoose folder into rest-server


In app.js:

Here we want to initiate connection to mongodb server

var mongoose = require('mongoose');
var url = 'mongodb://localhost:27107/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected correctly to server');
});

Now we want to make the dishRouter work in communicating with the mongoDB Server

Open dishRouter.js

Require mongoose and dishes model

var mongoose = require('mongoose');
var Dishes = require('../models/dishes');

Now we need to configure GET, POST, PUT, DELETE methods

Remove the .all() part

.get(function (req, res, next) {
        Dishes.find({}, function (err, dish) {
            if(err) throw err;
            res.json(dish);
        });
    })


res.json() is a method on response msg that we are gonna send back. It converts js object to JSON

Note: status code 200 and content-type: application/json will be set automatically

Now we will update post() method

When we POST body of msg will contain new dish to be posted into the dishes collection
Also remember that the request's body will be converted in JSON by body-parser

Dishes.create(req.body, function (err, dish) {
            if(err) throw err;
            console.log('Dish created');
            var id = dish._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added the dish with id: ', id);
        });


req.body is the dish to be added in JSON. In addition to adding the dish we are also
sending a reply back to the client

DELETE

.delete(function (req, res) {
        // res.end("Deleting all the dishes!!");
        Dishes.remove({}, function (err, resp) {
            if(err) throw err;
            res.json(resp);
        });
    })

resp -> response.. It is a js object indicating how many objects are deleted

Next we have to take care of those operations which require the parameters

We delete the all() part

.get(function (req, res, next) {
        // res.end("Sending the dish with id: " + req.params.dishId);
        Dishes.findById(req.params.dishId, function (err, dish) {
            if(err) throw err;
            res.json(dish);
        })
    })


.put(function (req, res) {
        Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true}, function (err, dish) {
            if(err) throw err;
            res.json(dish);
        });
    });

.delete(function (req, res, next) {

        Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
            if(err) throw err;
            res.json(resp);
        });
    })

Handling Comments
______________________

Handling comments is a special case as comments are embedded inside the dish documents themselves

dishRouter.route('/:dishId/comments')
    .get(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if(err) throw err;
            res.json(dish.comments);
        });
    })

.delete(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            for (var i = dish.comments.length; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Deleted all comments!!');
            });
        });
    })


For specific comments:

dishRouter.route('/:dishId/comments/:commentId')

get():

.get(function (req, res) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if(err) throw err;
            res.json(dish.comments.id(req.params.commentId));
        });
    })


For put() we delete the existing comment and insert updated comment as a new comment

Testing the API
___________________

Open POSTMAN

POST on http://localhost:3000/dishes/

{
    "name": "Uthapizza",
    "image": "images/uthapizza.png",
    "category": "mains",
    "label": "Hot",
    "price": "4.99",
    "description": "ok"
}
This data is sent in body of request msg

GET http://localhost:3000/dishes/
GET http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e to GET dish with specific id

PUT http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e
msg:
{"label": "New"}

The label will be updated

POST A COMMENT:

POST http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e/comments

msg:
{
  "rating": 5,
  "comment": "Imagine all the eatables, living in conFusion!",
  "author": "John Lemon"
}

GET all comments: http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e/comments

GET particular comment http://localhost:3000/dishes/[dishId]/comments/[commentId]


Updating a Specific comment:

PUT http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e/comments/57cc04be76cd31d817990f0a

msg: updated comment object

{
  "rating": 5,
  "comment": "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
  "author": "Paul McVites"
}


Also note id of that comment would be changed

DELETE first comment

DELETE http://localhost:3000/dishes/57cbe3eb5aed752011b98e0e/comments/57cc048776cd31d817990f09


BASIC AUTHENTICATION
_______________________________

When a client initiates a request server may respond back with HTTP 401 i.e unauthorized user

Reply from server:
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic

WWW-Authenticate: Basic is header field. It specifies that basic access authentication is to
be performed by the client

In response to this the client will request for user to type in username and password
It will take this username and password and encode it in the next outgoing request:

GET /index.html HTTP/1.1
Authorization: Basic QWxhZGRpbjpvcGVUIHNIc2FtZQ==
Host: www.cse.ust.hk

QWxhZGRpbjpvcGVUIHNIc2FtZQ is a base64 encoded string

Authorization Header:

1. Username and password are combined into a string "username:password"
2. The resulting string literal is then encoded using base64
3. Authorization method and a space is put b4 encoded string:
Authorization: Basic QWxhZGRpbjpvcGVUIHNIc2FtZQ==

Using express we can require authentication at various levels: for entire app, for specific route or
for specific operation on a given route

Exercise
___________

Create folder basic-auth

From node-express/ copy server.js and public folder and package.json and paste into basic-auth/

do sudo npm install

Here we want to do authentication on the entire application i.e whenever u access server u need to
authenticate yourself

We are going to create a specific middleware called auth and inside this we will insert the code that
does the basic authentication

We expect username and password to be passed in as basic authentication from the client side
That will come in as request message in request authentication field

function auth(req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if(!authHeader){
        var err = new Error('You are not authenticated!!');
        err.status = 401;
        next(err);
        return;
    }
}

status code 401 means authorization has failed

note the calling of next() with err as parameter:

this automatically raises the error
So as we go down the chain of middlewares only the function that takes the error and
then uses it will be triggered. The remaining ones will be bypassed!!

If authorization header is set we need to parse out authorization header to extract
out username and password

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


next() -> if authenticated correctly continue on to the next middleware

Note: next middleware is app.use(express.static(__dirname + '/public/'));

Finally this auth() function is a middleware
We need to use it

app.use(auth);


Order of middlewares:
_________________________

Middlewares are applied to any incoming requests in the order specified in the application

1. app.use(morgan('dev'));
2. app.use(auth);
3. app.use(express.static(__dirname + '/public/'));

So first it will do the logging
Then it will apply auth function
Then it will do static serving of files

We now need a middleware to handle error

app.use(function (err, req, res, next) {
    ...
});

so next(err) drops into this middleware

app.use(function (err, req, res, next) {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

'WWW-Authenticate': 'Basic',
'Content-Type': 'text/plain'

We are sending this as a response to client to remind them that basic authentication is needed

err.message will be var error = new Error('You are not authenticated!!'); i.e You are not authenticated!!

Run app..

Since we did console.log(req.headers); a bunch of info is printed into the console

GET /aboutus.html 304 1.143 ms - -
{ host: 'localhost:8080',
  connection: 'keep-alive',
  authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'accept-encoding': 'gzip, deflate, sdch',
  'accept-language': 'en-US,en;q=0.8,ru;q=0.6',
  cookie: 'csrftoken=QuMmkiwwrYQHqfCGBDqV3k54e78KwFrZ; _ga=GA1.1.417615266.1469763276',
  'if-none-match': 'W/"9b-1568a776258"',
  'if-modified-since': 'Sun, 14 Aug 2016 19:11:35 GMT' }

authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',

This is username and password encoded in base64


Cookies and Express Sessions
___________________________________________________________

Cookies: way for a server to track clients. Also client can send small pieces of info in the header
so that the server can track the clients. Cookie is included in the request header

Sessions: way of managing user sessions. HTTP is a state less protocol. So every request coming in
from the client is a new request. This is for the sake of scalability
But we need server to remember something about the client. Cookies and sessions help us here

When server wants client to set a cookie, it sends a header:
HTTP/1.1 401 Unauthorized
Set-Cookie: xxx...

Client remembers this cookie and all subsequent request from client will include a header field as:
GET /index.html HTTP/1.1
Cookie: xxx...
Host: abc.xyz

Server extracts this cookie and identifies client

Express Cookies:
____________________

Express server can send a cookie on client side by using cookie method on response msg
res.cookie(name, value, options)

Cookies are parsed using cookie-parser which is a middleware

Cookie-parser parses incoming cookies and attaches them to request msg:
req.cookies.name

Cookies can be forged from Client side. To avoid this server can set a Signed Cookie on client side
Signed cookie: cookie signed with a secret key on server side. Only server knows this

In cookie, server includes a digital signature with a key-hash msg authentication code
This sign is included in cookie and available for client
If Client or any other man-in-the-middle tries to modify cookie, when cookie is received by server
it will recognize this tamperance

In option specify sign = true
Client side:
app.use(cookieParser('secret key');
cookieParser requires secret key so that it can ensure that icoming cookie has not been tampered with

If cookie is valid, signed cookie is made available in request object on server side as:
req.signedCookie.name

Express Sessions
___________________

Cookies suitable for small info only

Express sessions is a middleware

It enables us to track user on server side using 2 pieces of info:

-Combination of cookie where session-id is set. This session-id is used
as a key to access storage on server side. This storage can track a lot more info about
the session b/w client and server. Session info is stored in memory in server side.
So if server is restarted this memory is wiped out. So info will be lost if server restarts.
If we need to access info across server restarts we need some kind of permanent storage on server side:
- use either local store or mongoose store
Also we can have multiple replicated servers. All these servers have distributed session store.
So any of them has session info. This is also supported through express sessions

Express session Middleware:

var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(session({
name: 'session-id',
secret: '12345-67890-09876-54321',
saveUninitialized: true,
resave: true,
store: new FileStore()
}));

var FileStore = require('session-file-store')(session); => We are using local file store

name, secret, etc are set of options
secret is the secret key for signing the cookie
store: what is being used to store the info permanently
default:info will be tracked in-memory in server side

When a client req comes, cookie is parsed and session info is made available as:
req.session.name





