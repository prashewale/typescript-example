//mongodb and mongoose
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const connectionUrl = process.env.MONGODB_URL;

if (!connectionUrl) {
  throw new Error('MongoDB connection url not found');
}

const dbName = process.env.DB_NAME;

if (!dbName) {
  throw new Error('Database name not found');
}

const client = new MongoClient(connectionUrl);
let db: Db;

export const connectToDb = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB', err);
    throw err;
  }
};

export const getDb = () => db;
