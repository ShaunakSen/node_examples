var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var AdminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    department: String,
    full_name: String,
    created_forms: [String]
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminSchema);