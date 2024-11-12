import { Request, Response, NextFunction } from 'express';

export function AuthMiddeware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({
      status: 'fail',
      message: 'Unauthorized',
    });
    return;
  }

  if (authHeader != 'Test123') {
    res.status(401).send({
      status: 'fail',
      message: 'Invalid Token',
    });

    return;
  }

  next();
}
