var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.get('/signup', authController.showRegister);
router.post('/signup', authController.signUpDataValidation, authController.postRegister);
router.post('/login', authController.loginDataValidation, authController.postLogin);
router.get('/info', usersController.authMiddleware, usersController.getUserInfo);
module.exports = router;
