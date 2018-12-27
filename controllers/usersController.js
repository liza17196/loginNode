const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers['access-token'];
    jwt.verify(token, process.env.JWT_KEY, function (error, success) {
        if (error) {
            return res.status(401).send({
                user: {},
                message: 'Failed to authenticate token.'
            });
        } else {
            req.body.user = success;
            next();
        }
    });
};

exports.getUserInfo = (req, res) => {
    res.render('info', { title: 'User Info', user: req.body.user});
}
