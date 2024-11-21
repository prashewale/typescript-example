//mongodb and mongoose
import { MongoClient, Db } from 'mongodb';

export class DatabaseClient {
  private static client: MongoClient | null;
  private static db: Db | null;

  static async connect(url: string, dbName: string): Promise<Db> {
    if (!this.client) {
      this.client = new MongoClient(url);
      await this.client.connect();

      this.db = this.client.db(dbName);
    }

    if (!this.db) {
      throw new Error('Database connection not establised.');
    }

    return this.db;
  }

  static getDb(): Db {
    if (!this.db) {
      throw new Error('Database connection not establised.');
    }

    return this.db;
  }

  static async close() {
    if (!this.client) {
      return;
    }

    await this.client.close();
    this.client = null;
    this.db = null;
  }
}
