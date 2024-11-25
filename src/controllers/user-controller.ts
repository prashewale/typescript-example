import { DatabaseClient } from '@/services/data/database-connection';
import { UserRepository } from '@/services/repo-services/user-repository';
import { isNullOrUndefined } from '@/utils/common-utils';
import { Request, Response } from 'express';
import { Document, Filter, ObjectId, WithId } from 'mongodb';

export class UserController {
  constructor(private _userRepo: UserRepository) {}

  getUsers = async (req: Request, res: Response) => {
    const { name, team } = req.query;

    const filter = [] as Filter<Document>[];

    if (name) {
      filter.push({ name: { $regex: name, $options: 'i' } });
    }

    if (team) {
      filter.push({ team: { $regex: team, $options: 'i' } });
    }

    const userDetails = await this._userRepo.getUsers(filter);

    res.send(userDetails);
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const availableUserDetail = await this._userRepo.getUserById(id);

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
    const user = req.body as User;

    if (!user) {
      res.status(400).send({
        status: 'fail',
        message: 'Please provide all the details',
      });

      return;
    }

    const { name, team, role } = user;
    if (!name || !team || !role) {
      res.status(400).send({
        status: 'fail',
        message: 'Please provide all the details',
      });

      return;
    }

    const availableUserDetail = await this._userRepo.createUser(user);

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
