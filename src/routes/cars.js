const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const checkAuth = require('../middleware/checkAuth');

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', carController.createCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', checkAuth, carController.deleteCar);

module.exports = router;
