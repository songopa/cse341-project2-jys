const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');



module.exports = router;
