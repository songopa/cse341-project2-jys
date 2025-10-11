const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');
const { requiresAuth } = require('express-openid-connect');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', checkAuth, userController.updateUser);
router.delete('/:id', checkAuth, userController.deleteUser);
router.get('/profile/details', requiresAuth(), userController.profileView);

module.exports = router;
