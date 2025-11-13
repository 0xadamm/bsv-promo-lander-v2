import { MongoClient, Db } from "mongodb";
import type { Content, Sport, Ailment } from "@/types/database";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not constantly created
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "bsv-content";
  return client.db(dbName);
}

// Collection names
export const COLLECTIONS = {
  CONTENT: "content",
  SPORTS: "sports",
  AILMENTS: "ailments",
} as const;

// Helper function to get typed collections
export async function getContentCollection() {
  const db = await getDb();
  return db.collection<Content>(COLLECTIONS.CONTENT);
}

export async function getSportsCollection() {
  const db = await getDb();
  return db.collection<Sport>(COLLECTIONS.SPORTS);
}

export async function getAilmentsCollection() {
  const db = await getDb();
  return db.collection<Ailment>(COLLECTIONS.AILMENTS);
}

// Create indexes
export async function createIndexes() {
  const db = await getDb();

  // Content indexes
  const contentCollection = db.collection(COLLECTIONS.CONTENT);
  await contentCollection.createIndex({ slug: 1 }, { unique: true });
  await contentCollection.createIndex({ publishedAt: -1 });
  await contentCollection.createIndex({ featured: 1 });
  await contentCollection.createIndex({ contentType: 1 });
  await contentCollection.createIndex({ sports: 1 });
  await contentCollection.createIndex({ ailments: 1 });

  // Sports indexes
  const sportsCollection = db.collection(COLLECTIONS.SPORTS);
  await sportsCollection.createIndex({ slug: 1 }, { unique: true });
  await sportsCollection.createIndex({ displayOrder: 1 });

  // Ailments indexes
  const ailmentsCollection = db.collection(COLLECTIONS.AILMENTS);
  await ailmentsCollection.createIndex({ slug: 1 }, { unique: true });
  await ailmentsCollection.createIndex({ category: 1 });
  await ailmentsCollection.createIndex({ displayOrder: 1 });

  console.log("✅ Database indexes created successfully");
}

export default clientPromise;
