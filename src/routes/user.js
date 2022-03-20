import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  login,
  resetPassword,
} from '../controllers/user';
import { authenticate, hasRole } from '../middlewares/auth';
import { userRole } from '../models/user';

const userRouter = new express.Router();

userRouter.post('/login', login);
userRouter.post(
  '/create-user',
  authenticate,
  hasRole([userRole.SUPER_ADMIN, userRole.ADMIN]),
  createUser,
);

userRouter.post('/reset-password', resetPassword);

userRouter.get(
  '/get-user/:id',
  authenticate,
  hasRole([userRole.SUPER_ADMIN, userRole.ADMIN]),
  getUserById,
);

userRouter.delete(
  '/delete-user/:id',
  authenticate,
  hasRole([userRole.SUPER_ADMIN, userRole.ADMIN]),
  deleteUser,
);

export { userRouter };
