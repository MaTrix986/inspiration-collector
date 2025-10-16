import { MongoClient, Db } from 'mongodb';

declare global {
  var mongoClient: MongoClient | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'inspiration_collector';

let client: MongoClient;
let db: Db;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

export async function connectToDatabase() {
  try {
    if (client && db) {
      return { client, db };
    }

    if (process.env.NODE_ENV === 'development') {
      // In development, use a global variable to preserve the client across module reloads
      if (!global.mongoClient) {
        global.mongoClient = new MongoClient(MONGODB_URI);
        await global.mongoClient.connect();
      }
      client = global.mongoClient;
      db = client.db(MONGODB_DB);
    } else {
      // In production, create a new client for each request
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db(MONGODB_DB);
    }

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export async function disconnectFromDatabase() {
  if (client) {
    await client.close();
  }
}