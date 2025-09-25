const { getDb } = require('../database/db');
const Joi = require('joi');

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
        const db = getDb();
        const cars = await db.collection('cars').find().toArray();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const db = getDb();
        const car = await db.collection('cars').findOne({ _id: req.params.id });
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
        const db = getDb();
        const result = await db.collection('cars').insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCar = async (req, res) => {
    const { error } = carSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const db = getDb();
        const result = await db.collection('cars').updateOne({ _id: req.params.id }, { $set: req.body });
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('cars').deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
