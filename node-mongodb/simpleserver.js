var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/conFusion';

MongoClient.connect(url, function (err, db) {
    //returns reference to database
    assert.equal(err, null);
    console.log("Connected correctly to server");

    var collection = db.collection("dishes");
    // INSERT A DOCUMENT INTO COLLECTION
    collection.insertOne({name: "Uthapizza", description: "Very tasty..."}, function (err, result) {
        assert.equal(err, null);
        console.log("After Insert");
        console.log(result.ops);

        // NOW THAT INSERT IS DONE I WANT TO FIND

        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found: ");
            console.log(docs);

            // DELETE THE COLLECTION TO SET DB TO PRISTINE CONDITION
            db.dropCollection("dishes", function (err, result) {
                assert.equal(err, null);
                db.close();
            });
        });
    });
});