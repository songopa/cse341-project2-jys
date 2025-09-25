
const { getDb } = require('../database/db');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    employment: Joi.string().optional(),
});

exports.getAllUsers = async (req, res) => {
    try {
        const db = getDb();
        const users = await db.collection('users').find().toArray();
        //remove passwords from response
        users.forEach(user => delete user.password);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        delete user.password; // Remove password from response
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const db = getDb();
        const result = await db.collection('users').insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    // const { error } = userSchema.validate(req.body);
    // if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const db = getDb();
        const result = await db.collection('users').updateOne({ _id: req.params.id }, { $set: req.body });
        if (result.matchedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('users').deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.registerUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const db = getDb();
        // Check if email already exists
        const existing = await db.collection('users').findOne({ email: req.body.email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userToSave = { ...req.body, password: hashedPassword };
        const result = await db.collection('users').insertOne(userToSave);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    try {
        const db = getDb();
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        // Start session
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        // Remove password from response
        const { password: _, ...userData } = user;
        res.json({ message: 'Login successful', user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
