import { responseHandler } from '../../utils/responseHandler';

export const hasRole = (roles = []) => {
  let roleList = roles;
  if (typeof roleList === 'string') {
    roleList = [roleList];
  }

  return (req, res, next) => {
    if (roleList.length !== 0 && !roleList.includes(req.user.role)) {
      // user's role is not authorized
      responseHandler(req, res, 401);
    }

    // authentication and authorization successful
    next();
  };
};
