var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var mcqSchema = new Schema({
    questionNo: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    optionValues: [{type: Number}],
    optionTitles: [{type: String}],
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
    displayEmotion: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});


var reviewSchema = new Schema({
    mcq: [mcqSchema],
    postedBy: {
        name: String,
        email: String
    }
}, {timestamps: true});

var Reviews = mongoose.model('Review', reviewSchema);
module.exports = Reviews;