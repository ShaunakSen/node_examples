var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mcqResponseSchema = new Schema({
    questionNo: {
        type: Number,
        required: true
    },
    // title: {
    //     type: String,
    //     required: true
    // },
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
    }
}, {timestamps: true});

var responseSchema = new Schema({
    //TODO add in review id here
    mcqResponse: [mcqResponseSchema],
    postedBy: {
        name: String,
        email: String
    }
}, {timestamps: true});

var Responses = mongoose.model('Response', responseSchema);
module.exports = Responses;