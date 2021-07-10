const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema(
    {
        email:
        {
            type: String,
            require: true,
        },
        departure:
        {
            type: String,
            require: true,
        }, 
        name:
        {
            type: String, 
            require: false,
        },
    }
);

UserSchema.plugin(passportLocalMongoose); //add username and password to userSchema 

module.exports = mongoose.model('User', UserSchema);