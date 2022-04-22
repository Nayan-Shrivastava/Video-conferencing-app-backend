/* eslint-disable require-atomic-updates */
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { responseHandler } from '../../utils/responseHandler';
import { User } from '../../models/user';
import config from '../../configs/index';

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verify(token, config.jwtSecret);
    // TODO: need to modify auth token to include _id
    const user = await User.findOne({
      _id: decoded._id,
      // 'tokens.token': token,
    });
    if (!user) {
      responseHandler(req, res, 404);
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    responseHandler(req, res, 401);
  }
};
