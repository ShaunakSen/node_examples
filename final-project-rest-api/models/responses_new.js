/**
 * Created by shaunak on 8/2/17.
 */

// New responses model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var textResponseSchema = new Schema({
    title: {
        type: String
    },
    response: {
        type: String
    },
    correct: {type: Boolean}
}, {timestamps: true});

var mcqResponseSchema = new Schema({
    questionNo: {
        type: Number,
        required: true
    },
    title: {
        type: String
    },
    response: {
        type: Number,
        required: true
    },
    responseText: {
        type: String
    },
    timeSpent: {
        type: Number,
        required: true
    },
    importance: {
        type: Number,
        min: 1,
        max: 10
    },
    thoughtProvoking: {
        type: Number,
        min: 1,
        max: 5
    },
    relatedTo: [{
        // Probably use populate() here
        questionNo: Number,
        relatedHow: String
    }],
    correct: {type: Boolean}
}, {timestamps: true});

var responseSchema = new Schema({
    //TODO add in review id here

    reviewId: {type: String},
    overallScore: {type: Number},
    filtered: {type: Boolean},
    mcqResponse: [mcqResponseSchema],
    textResponse : [textResponseSchema],
    postedBy: {
        full_name: String,
        roll_number: String,
        username: String,
        email: String
    }
}, {timestamps: true});

var Responses = mongoose.model('Response_new', responseSchema);
module.exports = Responses;