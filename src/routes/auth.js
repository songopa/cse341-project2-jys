const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// User registration route
// router.post('/register', userController.createUser);
// router.get('/register', (req, res) => {
//     res.render('register');
// });

// Profile view route
// router.get('/profile', requiresAuth(), userController.profileView);

// User login route
// router.post('/login', userController.loginUser);
// router.get('/login', userController.loginView);

module.exports = router;
