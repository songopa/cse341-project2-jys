
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().optional(),
    role: Joi.string().valid('user', 'admin').required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    employment: Joi.string().optional(),
});

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        //remove passwords from response
        users.forEach(user => delete user.password);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
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
        const result = await userModel.insertUser(req.body);
        if (!result) return res.status(400).json({ error: 'Email already registered' });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    // const { error } = userSchema.validate(req.body);
    // if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is missing or empty.' });
        }
        const result = await userModel.updateUser(req.params.id, req.body);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated', user: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await userModel.deleteUser(req.params.id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    try {
        const user = await userModel.getUserByEmail(email);
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
