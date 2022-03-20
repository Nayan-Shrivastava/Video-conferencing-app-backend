import { User, userRole } from '../models/user';
import { responseHandler } from '../utils/responseHandler';

export const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    responseHandler(req, res, 200, null, { token, user });
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const createUser = async (req, res) => {
  const user = new User(req.body);
  if (
    user.role !== userRole.Superadmin &&
    user.role !== userRole.Admin &&
    user.role !== userRole.Cashier
  ) {
    responseHandler(req, res, 400, `${user.role} is not a valid role`);
  }
  try {
    if (
      user.role === userRole.Superadmin ||
      (user.role === userRole.Admin && req.user.role !== userRole.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }
    user.changedDefaultPassword = false;
    await user.save();
    if (user.email) {
      // sendWelcomeEmail(user.email, user.name);
    }

    responseHandler(req, res, 201, null, { user });
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
