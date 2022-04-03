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
import { authenticate } from '../middlewares/auth';

const userRouter = new express.Router();

userRouter.get('/', getAllUsers);
userRouter.post('/login', login);
userRouter.post('/signup', createUser);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/auth/google', loginWithGoogle);

userRouter.get('/get-user/:id', authenticate, getUserById);

userRouter.delete('/delete-user/:id', authenticate, deleteUser);

export { userRouter };
