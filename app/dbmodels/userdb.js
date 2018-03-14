var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String, //email
    name: String,
    password: String,
    interested_in: [{ type: Schema.Types.ObjectId, ref: 'category' }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);

