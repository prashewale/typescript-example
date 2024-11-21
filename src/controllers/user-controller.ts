import { DatabaseClient } from '@/services/data/database-connection';
import { isNullOrUndefined } from '@/utils/common-utils';
import { Request, Response } from 'express';
import { Document, ObjectId, WithId } from 'mongodb';

export class UserController {
  getUser = async (req: Request, res: Response) => {
    const collection = await getUserCollection();

    const { name, team } = req.query;
    let filteredUserDetails: WithId<Document>[] = [];

    if (!name && !team) {
      filteredUserDetails = await collection.find().toArray();
    }

    if (!name && team) {
      filteredUserDetails = await collection
        .find({ team: { $regex: team, $options: 'i' } })
        .toArray();
    }

    if (name && !team) {
      filteredUserDetails = await collection
        .find({ name: { $regex: name, $options: 'i' } })
        .toArray();
    }

    if (name && team) {
      filteredUserDetails = await collection
        .find({
          $and: [
            { name: { $regex: name, $options: 'i' } },
            { team: { $regex: team, $options: 'i' } },
          ],
        })
        .toArray();
    }

    res.send(filteredUserDetails);
  };

  getUserById = async (req: Request, res: Response) => {
    const collection = await getUserCollection();

    const { id } = req.params;

    const availableUserDetail = await collection.findOne({
      _id: new ObjectId(id),
    });

    // const availableUserDetail = userDetails.find(
    //   (user) => user.id === Number(id)
    // );

    if (isNullOrUndefined(availableUserDetail)) {
      res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    res.send(availableUserDetail);
    return;
  };

  createUser = async (req: Request, res: Response) => {
    const collection = await getUserCollection();

    const user = req.body;

    const { name, team, role } = user;
    if (!name || !team || !role) {
      res.status(400).send({
        status: 'fail',
        message: 'Please provide all the details',
      });

      return;
    }

    const insertedUser = await collection.insertOne(user);

    const availableUserDetail = await collection.findOne({
      _id: new ObjectId(insertedUser.insertedId),
    });

    res.send({
      status: 'success',
      message: 'User created successfully',
      data: availableUserDetail,
    });
  };

  updateWholeUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body;

    console.log(`id: ${id}, user: ${JSON.stringify(user)}`);

    const collection = await getUserCollection();

    const updatedUserResponse = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: user }
    );

    if (
      updatedUserResponse.modifiedCount === 0 &&
      updatedUserResponse.matchedCount === 0
    ) {
      res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });

      return;
    }

    res.send({
      status: 'success',
      message: 'User updated successfully',
      data: user,
    });
  };

  patchUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body;

    const collection = await getUserCollection();

    const availableUserDetail = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!availableUserDetail) {
      res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    const userToUpdate = { ...availableUserDetail, ...user };

    const updatedUserResponse = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: userToUpdate }
    );

    if (
      updatedUserResponse.modifiedCount === 0 &&
      updatedUserResponse.matchedCount === 0
    ) {
      res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    res.send({
      status: 'success',
      message: 'User updated successfully',
      data: userToUpdate,
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).send({
        status: 'fail',
        message: 'Please provide user id',
      });

      return;
    }

    const collection = await getUserCollection();

    const availableUserDetail = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!availableUserDetail) {
      res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    const deletedUserResponse = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedUserResponse.deletedCount == 0) {
      res.status(404).send({ status: 'fail', message: 'User not found' });
      return;
    }

    res.send({
      status: 'success',
      message: 'User deleted successfully',
      data: availableUserDetail,
    });
  };
}

const getUserCollection = async () => {
  const db = DatabaseClient.getDb();
  return db.collection('users');
};
