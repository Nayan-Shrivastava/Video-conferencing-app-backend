import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  login,
  resetPassword,
  getAllUsers,
  loginWithGoogle,
} from '../controllers/user';
import { authenticate, hasRole } from '../middlewares/auth';
import { userRole } from '../models/user';

const userRouter = new express.Router();

userRouter.get('/', getAllUsers);
userRouter.post('/login', login);
userRouter.post('/signup', createUser);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/auth/google', loginWithGoogle);

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
