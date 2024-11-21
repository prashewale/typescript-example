import express from 'express';
import type { Request, Response } from 'express';
import { isNullOrUndefined, createUniqueId } from '@/utils/common-utils';
import { loggerMiddleware } from '@/middlewares/logger-middleware';
import { AuthMiddeware } from './middlewares/auth-middleware';

import { DatabaseClient } from './services/data/database-connection';

import { UserController } from './controllers/user-controller';

import { env } from '@utils/config';
import { UserRoute } from './routes/user-routes';

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

DatabaseClient.connect(env.MONGODB_URL, env.DB_NAME);

const PORT = 5000;
const userController = new UserController();
const userRoute = new UserRoute(userController);
const userRouter = userRoute.registerRoutes();

app.use('/api', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
