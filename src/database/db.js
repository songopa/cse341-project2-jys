const { MongoClient } = require('mongodb');
let db;

async function connectToDb() {
    if (db) return db;
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    return db;
}

function getDb() {
    if (!db) throw new Error('DB not connected');
    return db;
}

module.exports = { connectToDb, getDb };
