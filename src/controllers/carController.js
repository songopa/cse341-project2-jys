const { getDb } = require('../database/db');
const Joi = require('joi');
const carModel = require('../models/car');

const carSchema = Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1886).required(),
    color: Joi.string().required(),
    vin: Joi.string().required(),
    mileage: Joi.number().required(),
    bodyType: Joi.string().required(),
    fuel: Joi.string().required(),
    cc: Joi.number().required(),
});

exports.getAllCars = async (req, res) => {
    try {
        const cars = await carModel.getAllCars();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await carModel.getCarById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCar = async (req, res) => {
    const { error } = carSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const result = await carModel.insertCar(req.body);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCar = async (req, res) => {
    const { error } = carSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const result = await carModel.updateCar(req.params.id, req.body);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const result = await carModel.deleteCar(req.params.id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
