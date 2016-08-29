var assert = require('assert');

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

exports.findDocuments = function (db, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);
    // FIND SOME DOCUMENTS
    coll.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    })
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

exports.updateDocument = function (db, document, update, collection, callback) {
    // GET THE DOCUMENTS COLLECTION
    var coll = db.collection(collection);

    coll.updateOne(document, {$set: update}, null, function(err, result){
        assert.equal(err, null);
        console.log("Updated document with " + update);
        callback(result);
    });
};