var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roll_number: String,
    full_name: String,
    filled_forms: [String]
});

UserSchema.plugin(passportLocalMongoose);   

module.exports = mongoose.model("User", UserSchema);