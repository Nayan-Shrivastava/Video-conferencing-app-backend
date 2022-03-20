import { verify } from 'jsonwebtoken';
import { responseHandler } from '../../utils/responseHandler';
import { User } from '../../models/user';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
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
