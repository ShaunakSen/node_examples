var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var dboper = require('./operations');

var url = 'mongodb://localhost:27017/conFusion';

MongoClient.connect(url, function (err, db) {
    assert.equal(err, null);
    console.log("Connected correctly to server");
    dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, "dishes", function (result) {
        console.log(result.ops);
        // INSERTED SO NOW FIND
        dboper.findDocuments(db, "dishes", function (docs) {
            console.log(docs);

            // UPDATE
            dboper.updateDocument(db, {name: "Vadonut"}, {description: "Updated Test"}, "dishes", function (result) {
                console.log(result.result);

                // FIND
                dboper.findDocuments(db, "dishes", function (docs) {
                    console.log(docs);

                    // DROP THE COLLECTION
                    db.dropCollection("dishes", function (result) {
                        console.log(result);
                        db.close();
                    });
                });
            });
        });
    });
});