var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/demo');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "first_name" : String,
    "last_name" : String,
    "email": String,
    "gender": String,
    "ip_address": String,
};
// create model if not exists.
module.exports = mongoose.model('users',userSchema);