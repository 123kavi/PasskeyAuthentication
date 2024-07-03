const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.createUser);
router.get('/:userId', userController.getUserById);

module.exports = router;
