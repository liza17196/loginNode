import {Schema, mongoose} from 'mongoose';
import validator from 'validator';
import mongodbErrorHandler from 'mongoose-mongodb-errors';
import passportLocalMongoose from 'passport-local-mongoose';
import passportJwt from 'passport-jwt';
import bcrypt from 'bcrypt';

class userSchema extends Schema({
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

export default mongoose.model('User', userSchema);
