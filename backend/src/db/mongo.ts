import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL ?? 'mongodb://localhost:27017/emtec');

let conectado = false;

export async function getMongoDb() {
  if (!conectado) {
    await client.connect();
    conectado = true;
  }
  return client.db();
}