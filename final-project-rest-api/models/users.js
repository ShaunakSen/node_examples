// We have users collection that is handled by client-app-1-new
// But the data should be reflected back in this API route as well
// So when we register a user there we need to send a POST request to add the data of that user in API


// scheme will be similar to that in client-app-1-new

var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roll_number: String,
    full_name: String,
    flags:{
        type: Number,
        default: 0
    },
    filled_forms: [{type: String}]
});

module.exports = mongoose.model("User_api", UserSchema);