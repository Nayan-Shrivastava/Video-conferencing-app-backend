const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const {
  errorResponses,
  messageResponses,
  responseHandler,
} = require("../utils/responseHandler");
const auth = require("../middlewares/auth/authenticate");
const hasRole = require("../middlewares/auth/authorize");
const Role = require("../middlewares/auth/role.enum");
const {
  login,
  createUser,
  resetPassword,
  deleteUser,
  getUserById,
} = require("../controllers/user");
router.post("/login", login);

router.post(
  "/create-user",
  auth,
  hasRole([Role.Superadmin, Role.Admin]),
  createUser
);

router.post("/reset-password", resetPassword);

router.get(
  "/get-user/:id",
  auth,
  hasRole([Role.Superadmin, Role.Admin]),
  getUserById
);

router.delete(
  "/delete-user/:id",
  auth,
  hasRole([Role.Superadmin, Role.Admin]),
  deleteUser
);

module.exports = router;
