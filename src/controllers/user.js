import bcrypt from 'bcryptjs';
import { User, userRole } from '../models/user';
import { responseHandler } from '../utils/responseHandler';
import userService from '../services/user';
/**
 * POST `/api/v1/user/login`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs'
 * }
 */
export const login = async (req, res) => {
  try {
    const { email: userEmail, password } = req.body;
    const user = await userService.findByCredentials(userEmail, password);
    const token = await userService.generateAuthToken(user);
    const { _id, email, name, createdAt } = user;
    const message = { _id, createdAt, email, name, token };
    responseHandler(req, res, 200, null, message);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

/**
 * POST `/api/v1/user/signup`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs',
 *    name: 'abcd'
 * }
 */
export const createUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    const password = await bcrypt.hash(req.body.password, 8);
    const user = new User({ email, name, password });
    await user.save();
    responseHandler(req, res, 200, null, null);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password,
    );

    // reflecting that password has been reset once
    if (!user.changedDefaultPassword) {
      user.changedDefaultPassword = true;
    }
    user.password = newPassword;
    user.save();
    responseHandler(req, res, 200);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404);
    }

    if (
      user.role === userRole.Superadmin ||
      (user.role === userRole.Admin && req.user.role !== userRole.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }

    responseHandler(req, res, 200, null, { user });
  } catch (e) {
    responseHandler(req, res, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404);
    }

    if (
      user.role === userRole.Superadmin ||
      (user.role === userRole.Admin && req.user.role !== userRole.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }

    user = await User.findOneAndDelete({ _id: userId });

    responseHandler(req, res, 200, null, { user });
  } catch (e) {
    responseHandler(req, res, 500, e);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, ['-password', '-tokens', '-__v']);
    responseHandler(req, res, 200, null, { users });
  } catch (e) {
    responseHandler(req, res, 500, e);
  }
};
