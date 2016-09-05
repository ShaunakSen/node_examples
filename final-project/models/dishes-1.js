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

// WE HAVE CREATED THE SCHEMA. NOW WE NEED TO CREATE A MODEL USING IT
var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;