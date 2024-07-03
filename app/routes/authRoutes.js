const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/register-challenge', authController.registerChallenge);
router.post('/register-verify', authController.verifyRegistration);
router.post('/login-challenge', authController.loginChallenge);
router.post('/login-verify', authController.verifyLogin);

module.exports = router;
