const { MongoClient } = require('mongodb');

const url = process.env.DB_URL; // 내 몽고DB 주소 
let connectDB = new MongoClient(url).connect()

module.exports = connectDB