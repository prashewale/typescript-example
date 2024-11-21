import { UserController } from '@/controllers/user-controller';
import { AuthMiddeware } from '@/middlewares/auth-middleware';
import { Router } from 'express';

export class UserRoute {
  constructor(private _userController: UserController) {}
  routeList: Route[] = [
    {
      path: '/user',
      method: RequestMethod.GET,
      handler: this._userController.getUser,
    },
    {
      path: '/user/:id',
      method: RequestMethod.GET,
      handler: this._userController.getUserById,
    },
    {
      path: '/user',
      method: RequestMethod.POST,
      handler: this._userController.createUser,
      middlewares: [AuthMiddeware],
    },
    {
      path: '/user/:id',
      method: RequestMethod.PUT,
      handler: this._userController.updateWholeUser,
      middlewares: [AuthMiddeware],
    },

    {
      path: '/user/:id',
      method: RequestMethod.PATCH,
      handler: this._userController.patchUser,
      middlewares: [AuthMiddeware],
    },

    {
      path: '/user/:id',
      method: RequestMethod.DELETE,
      handler: this._userController.deleteUser,
      middlewares: [AuthMiddeware],
    },
  ];

  public registerRoutes(): Router {
    const router = Router();
    this.routeList.forEach((route) => {
      if (route.middlewares) {
        router[route.method](route.path, ...route.middlewares, route.handler);
      } else {
        router[route.method](route.path, route.handler);
      }
    });

    return router;
  }
}

type Route = {
  path: string;
  method: RequestMethod;
  handler: any;
  middlewares?: any[];
};

enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}
