const express = require("express");
const UsersController = require("./users.controller");

const UsersRouter = express.Router();

UsersRouter.post(
  "/auth/register",
  UsersController.validateCreateUser,
  UsersController._createUser
);

UsersRouter.get(
  "/current",
  UsersController.authorize,
  UsersController.getCurrentUser
);

UsersRouter.post(
  "/auth/login",
  UsersController.validateLogin,
  UsersController.login
);

UsersRouter.patch(
  "/auth/logout",
  UsersController.authorize,
  UsersController.logout
);

module.exports = UsersRouter;
