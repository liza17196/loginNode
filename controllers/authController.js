const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.showLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.showRegister = (req, res) => {
    res.render('signup', { title: 'Register' });
};

exports.signUpDataValidation = (req, res, next) => {
    req.sanitizeBody('nickname');
    req.checkBody('nickname', 'The nickname is required').notEmpty();
    req.checkBody('email', 'The email is required').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'The password is required').notEmpty();
    req.checkBody('password-confirm', 'The confirmed password is required').notEmpty();
    req.checkBody('password-confirm', 'The password confirmation does not match').equals(req.body.password);

    const errors = req.validationErrors();
  if (errors) {
      req.flash('error', errors.map(err => err.msg));
      res.render('signup', {body: req.body, flashes: req.flash() });
      return;
  }
  next();
}

exports.postRegister = (req, res) => {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hash_password = undefined;
            const token = jwt.sign({ email: user.email, nickname: user.nickname, _id: user._id}, process.env.JWT_KEY);
            return res.json({user, token});
        }
    });
}

exports.loginDataValidation = (req, res, next) => {
    req.checkBody('email', 'The email is required').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'The password is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        console.log(req.body);
        res.render('login', {body: req.body, flashes: req.flash() });
        return;
    }
    next();
}

exports.postLogin = (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user || (user && !user.comparePassword(req.body.password, user.hash_password))) {
            res.status(401).json({ message: 'Authentication failed. Please, check your email and password and try again.' });
        } else {
            const token = jwt.sign({ email: user.email, nickname: user.nickname, _id: user._id}, process.env.JWT_KEY);

            return res.json({user, token});
        }
    });
};
