import { getDb } from '@/services/data/database-connection';
import { isNullOrUndefined } from '@/utils/common-utils';
import { Request, Response } from 'express';
import { Document, ObjectId, WithId } from 'mongodb';

export const getUser = async (req: Request, res: Response) => {
  const db = getDb();

  const collection = db.collection('users');
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

export const getUserById = async (req: Request, res: Response) => {
  const db = getDb();

  const collection = db.collection('users');
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

export const createUser = async (req: Request, res: Response) => {
  const db = getDb();

  const collection = db.collection('users');

  const user = req.body;

  const { name, team, role } = user;
  if (!name || !team || !role) {
    res.status(400).send({
      status: 'fail',
      message: 'Please provide all the details',
    });

    return;
  }

  await collection.insertOne(user);

  res.send({ status: 'success', message: 'User created successfully' });
};
