const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requiresAuth } = require('express-openid-connect');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', requiresAuth(), userController.updateUser);
router.delete('/:id', requiresAuth(), userController.deleteUser);
router.get('/profile/details', requiresAuth(), userController.profileView);

module.exports = router;
