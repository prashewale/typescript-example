import { Filter, ObjectId } from 'mongodb';
import { DatabaseClient } from '../data/database-connection';

export class UserRepository {
  createUser = async (newUser: any) => {
    const collection = await this.getUserCollection();

    const insertedUser = await collection.insertOne(newUser);

    const availableUserDetail = await collection.findOne({
      _id: new ObjectId(insertedUser.insertedId),
    });

    return availableUserDetail;
  };

  updateUser(id: string, user: any) {}

  getUserById(id: string) {}

  deleteUser(id: string) {}

  getUsers = async (filter: Filter<any>) => {
    const collection = this.getUserCollection();
    return (await collection).find(filter).toArray();
  };

  private getUserCollection = async () => {
    const db = DatabaseClient.getDb();
    return db.collection('users');
  };
}
