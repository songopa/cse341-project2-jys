const db = require('../database/db')
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const collectionName = 'users';
let collection;

async function connect() {
    if (!collection) {
        collection = db.getDb().collection(collectionName);
    }
    return collection;
}
async function insertUser(user) {
    const col = await connect();
    // Check if email already exists
    const existing = await getUserByEmail(user.email);
    if (existing) return false

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return col.insertOne(user);
}
async function getUserById(id) {
    const col = await connect();
    return col.findOne({ _id: new ObjectId(id) });
    
}
async function getUserByEmail(email) {
    const col = await connect();
    return col.findOne({ email });
}
async function getAllUsers() {
    const col = await connect();
    return col.find().toArray();
}
async function updateUser(id, update) {
    const col = await connect();
    const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
    )
    return result;
}
async function deleteUser(id) {
    const col = await connect();
    return col.deleteOne({ _id: new ObjectId(id) });
}

module.exports = { insertUser, getUserById, getUserByEmail, getAllUsers, updateUser, deleteUser };

const userSchema = {
    _id: 'string',
    name: "string",
    email: "string",
    password: "string",
    role: "string",
    gender: "string",
    address: "string",
    phone: "string",
    employment: "string"
};