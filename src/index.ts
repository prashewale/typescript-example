import express from 'express';
import type { Request, Response } from 'express';
import { isNullOrUndefined, createUniqueId } from './utils/common-utils';

const app = express();
app.use(express.json());

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

app.get('/user', (req: Request, res: Response) => {
  const { name, team } = req.query;

  let filteredUserDetails = userDetails;

  if (!isNullOrUndefined(name)) {
    const nameLowerCase = (name as string).toLowerCase();

    filteredUserDetails = filteredUserDetails.filter((user) =>
      user.name.toLowerCase().startsWith(nameLowerCase)
    );
  }

  if (!isNullOrUndefined(team)) {
    const teamLowerCase = (team as string).toLowerCase();

    filteredUserDetails = filteredUserDetails.filter(
      (user) => user.team.toLowerCase() === teamLowerCase
    );
  }

  res.send(filteredUserDetails);
});

app.get('/user/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const availableUserDetail = userDetails.find(
    (user) => user.id === Number(id)
  );

  if (isNullOrUndefined(availableUserDetail)) {
    res.status(404).send({
      status: 'fail',
      message: 'User not found',
    });
    return;
  }

  res.send(availableUserDetail);
  return;
});

app.post('/user', (req: Request, res: Response) => {
  const user = req.body;

  const { name, team, role } = user;
  if (!name || !team || !role) {
    res.status(400).send({
      status: 'fail',
      message: 'Please provide all the details',
    });

    return;
  }

  const id = createUniqueId(userDetails);

  const newUser = { ...user, id };

  userDetails.push(newUser);

  res.send({ status: 'success', message: 'User created successfully' });
});

app.put('/user/:id', (req: Request, res: Response) => {
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

app.patch('/user/:id', (req: Request, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// http://localhost:5000/get-products?page=4

// GET - get all the details or filtered details or by id
// POST - create new data
// PUT - update existing data
// PATCH - partial update
// DELETE - delete existing data
