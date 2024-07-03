const express = require('express')
const router = express.Router()


router.get('/login', (req, res) => {
    res.render('auth/login'); 
});


router.get('/welcome', (req, res) => {
    res.render('pages/welcome'); 
});



// Route for signup page
router.get('/register', (req, res) => {
    res.render('auth/register'); 
});

// Example route handler for profile page
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard'); 

});


// const authController = require('../app/controllers/authController');
// router.post('/register', authController.register);
// router.post('/register-challenge', authController.registerChallenge);
// router.post('/register-verify', authController.verifyRegistration);
// router.post('/login-challenge', authController.loginChallenge);
// router.post('/login-verify', authController.verifyLogin);

// const userController = require('../app/controllers/userController');
// router.post('/register', userController.createUser);
// router.get('/:userId', userController.getUserById);












module.exports = router
