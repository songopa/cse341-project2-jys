const db = require('../database/db');
const { ObjectId } = require('mongodb');
const collectionName = 'cars';
let collection;

async function connect() {
    if (!collection) {
        const database = db.getDb();
        collection = database.collection(collectionName);
    }
    return collection;
}

async function insertCar(car) {
    const col = await connect();
    return col.insertOne(car);
}
async function getCarById(id) {
    const col = await connect();
    return col.findOne({ _id: new ObjectId(id) });
}
async function getAllCars() {
    const col = await connect();
    return col.find().toArray();
}
async function updateCar(id, update) {
    const col = await connect();
    const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
    );
    return result;
}

async function deleteCar(id) {
    const col = await connect();
    return col.deleteOne({ _id: new ObjectId(id) });
}

module.exports = { insertCar, getCarById, getAllCars, updateCar, deleteCar };

const carSchema = {
    _id: 'string',
    make: 'string',
    model: 'string',
    year: 'number',
    color: 'string',
    vin: 'string',
    mileage: 'number',
    bodyType: 'string',
    fuel: 'string',
    cc: 'number',
};
