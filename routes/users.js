const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

const {isLoggedIn, validateUser, registerValidation} = require('../middleware');

router.get('/register', users.renderRegister );

router.post('/register', registerValidation, catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login',passport.authenticate('local',{ failureFlash:true, failureRedirect:'/login'}), users.login);

router.get('/logout',users.logout);

//(reset the user's information should be in user's route)
router.get('/setting', isLoggedIn, catchAsync(users.renderSetting))

router.put('/setting', isLoggedIn, validateUser, catchAsync(users.setting))


module.exports = router;