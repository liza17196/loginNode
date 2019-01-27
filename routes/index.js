import {router, express} from 'express';
// var router = express.Router();
import usersController from '../controllers/usersController';
import authController from '../controllers/authController';

router.get('/login', authController.showLogin);
router.get('/signup', authController.showRegister);
router.post('/signup', authController.signUpDataValidation, authController.postRegister);
router.post('/login', authController.loginDataValidation, authController.postLogin);
router.get('/info', usersController.authMiddleware, usersController.getUserInfo);
module.exports = router;
