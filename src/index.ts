import express from 'express';
import type { Request, Response } from 'express';
import { isNullOrUndefined, createUniqueId } from '@/utils/common-utils';
import { loggerMiddleware } from '@/middlewares/logger-middleware';
import { AuthMiddeware } from './middlewares/auth-middleware';

import { connectToDb } from './services/data/database-connection';
import {
  createUser,
  getUser,
  getUserById,
} from './controllers/user-controller';

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

connectToDb();

const PORT = 5000;

let userDetails = [
  {
    name: 'Pravin Shewale',
    team: 'IT',
    role: 'Developer',
    id: 1,
  },
  {
    name: 'Pravin Deshmukh',
    team: 'Management',
    role: 'Manager',
    id: 2,
  },
  {
    name: 'Sumit Raut',
    team: 'IT',
    role: 'Developer',
    id: 3,
  },
  {
    name: 'Rahul Kumar',
    team: 'Sales',
    role: 'Executive',
    id: 4,
  },
];

app.get('/user', getUser);

app.get('/user/:id', getUserById);

app.post('/user', AuthMiddeware, createUser);

app.put('/user/:id', AuthMiddeware, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;

  console.log(`id: ${id}, user: ${JSON.stringify(user)}`);

  const availableUserDetail = userDetails.find(
    (user) => user.id === Number(id)
  );

  if (!availableUserDetail) {
    res.status(404).send({
      status: 'fail',
      message: 'User not found',
    });
    return;
  }

  const updatedUser = { ...user, id };

  userDetails = userDetails.map((user) => {
    if (user.id === Number(id)) {
      return updatedUser;
    }
    return user;
  });

  res.send({ status: 'success', message: 'User updated successfully' });
});

app.patch('/user/:id', AuthMiddeware, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;

  const availableUserDetail = userDetails.find(
    (user) => user.id === Number(id)
  );

  if (!availableUserDetail) {
    res.status(404).send({
      status: 'fail',
      message: 'User not found',
    });
    return;
  }

  const updatedUser = { ...availableUserDetail, ...user, id };

  userDetails = userDetails.map((user) => {
    if (user.id === Number(id)) {
      return updatedUser;
    }
    return user;
  });

  res.send({ status: 'success', message: 'User updated successfully' });
});

app.delete('/user/:id', AuthMiddeware, (req: Request, res: Response) => {
  const { id } = req.params;

  const availableUserDetail = userDetails.find(
    (user) => user.id === Number(id)
  );

  if (!availableUserDetail) {
    res.status(404).send({ status: 'fail', message: 'User not found' });
    return;
  }

  userDetails = userDetails.filter((user) => user.id !== Number(id));

  res.send({
    status: 'success',
    message: 'User deleted successfully',
    data: availableUserDetail,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// http://localhost:5000/get-products?page=4

// GET - get all the details or filtered details or by id
// POST - create new data
// PUT - update existing data
// PATCH - partial update
// DELETE - delete existing data
