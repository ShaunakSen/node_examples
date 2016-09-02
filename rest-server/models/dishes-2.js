var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// CREATE A SCHEMA

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

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
}, {timestamps: true});

// WE HAVE CREATED THE SCHEMA. NOW WE NEED TO CREATE A MODEL USING IT
var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;