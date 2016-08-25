console.log("In Module dishRouter");


exports.startLeaderServer = function (express,bodyParser, app, hostname, port) {
    var leaderRouter = express.Router();
    leaderRouter.use(bodyParser.json());
    leaderRouter.route('/')
        .all(function (req, res, next) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            next();
        })
        .get(function (req, res, next) {
            res.end("Sending all the leaders to u!!")
        })
        .delete(function (req, res, next) {
            res.end("Deleting all the leaders!!");
        })
        .post(function (req, res, next) {
            res.end("Will add the leader with name: " + req.body.name + " with details: " + req.body.description);
        });
    leaderRouter.route('/:leaderId')
        .all(function (req, res, next) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            next();
        })
        .get(function (req, res, next) {
            res.end("Sending the leader with id: " + req.params.leaderId);
        })
        .delete(function (req, res, next) {
            res.end("Deleting the leader with id: " + req.params.leaderId);
        })
        .put(function (req, res, next) {
            res.write("Updating leader with id: " + req.params.leaderId);
            res.end("\nWill update the leader with name: " + req.body.name + " with details: " + req.body.description);
        });
    app.use('/leadership', leaderRouter);
    // SERVING STATIC FILES
    app.use(express.static(__dirname + '/public/'));

    // app.listen(port, hostname, function () {
    //     console.log("Server Running at http://" + hostname + ":" + port);
    // });
};