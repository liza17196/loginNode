const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const passportJwt = require('passport-jwt');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply an email address'
    },
    nickname: {
        type: String,
        required: 'Please supply a nickname',
        trim: true
    },
    hash_password: {
        type: String,
        required: true,
    }
});

userSchema.plugin(mongodbErrorHandler);
userSchema.methods.comparePassword = (password, hash_password) => {
    return bcrypt.compareSync(password, hash_password);
}

module.exports = mongoose.model('User', userSchema);
