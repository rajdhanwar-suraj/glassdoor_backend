const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);


let dbInstance;

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbInstance = client.db(process.env.MONGO_DATABASE);
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
  }
};

const getDB = () => {
  return dbInstance;
};

module.exports = { connectDB, getDB };
