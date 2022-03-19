const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { responseHandler } = require("../utils/responseHandler");

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password
    );

    const token = await user.generateAuthToken();
    responseHandler(req, res, 200, undefined, { user, token });
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

const createUser = async (req, res) => {
  const user = new User(req.body);
  if (
    user.role !== Role.Superadmin &&
    user.role !== Role.Admin &&
    user.role !== Role.Cashier
  ) {
    responseHandler(req, res, 400, `${user.role} is not a valid role`);
  }
  try {
    if (
      user.role === Role.Superadmin ||
      (user.role === Role.Admin && req.user.role !== Role.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }
    user.changedDefaultPassword = false;
    await user.save();
    if (user.email) {
      //sendWelcomeEmail(user.email, user.name);
    }

    responseHandler(req, res, 201, undefined, { user });
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

const resetPassword = async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password
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

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404);
    }

    if (
      user.role === Role.Superadmin ||
      (user.role === Role.Admin && req.user.role !== Role.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }

    responseHandler(req, res, 200, undefined, { user });
  } catch (e) {
    responseHandler(req, res, 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404);
    }

    if (
      user.role === Role.Superadmin ||
      (user.role === Role.Admin && req.user.role !== Role.Superadmin)
    ) {
      responseHandler(req, res, 403);
    }

    user = await User.findOneAndDelete({ _id: userId });

    responseHandler(req, res, 200, undefined, { user });
  } catch (e) {
    responseHandler(req, res, 500, e);
  }
};

module.exports = { createUser, login, getUserById, deleteUser, resetPassword };
