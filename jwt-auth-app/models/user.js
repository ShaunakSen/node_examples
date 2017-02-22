var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model and pass it using module.exports

var userSchema = new Schema({
    name: String,
    password: String,
    admin: Boolean
});

module.exports = mongoose.model('User', userSchema);