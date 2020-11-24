const bcriptjs = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("./users.model");
const { UnauthorizedError } = require("./users.errors");

class UsersController {
  get createUser() {
    return this._createUser.bind(this);
  }
  async _createUser(req, res, next) {
    try {
      const { password, email } = req.body;
      const _constFactor = 6;
      const passwordHash = await bcriptjs.hash(password, _constFactor);
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        res.status(409).send("Email in use");
      }
      const user = await userModel.create({
        email,
        password: passwordHash,
      });
      return res.status(201).json({
        id: user._id,
        email: user.email,
        token: user.token,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { id, email, subscription } = req.user;
      res
        .status(200)
        .json({ id: id, subscription: subscription, email: email });
    } catch (err) {
      next();
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).send("Authentication failed");
      }
      const isPasswordValid = await bcriptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Authentication failed");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT);
      await userModel.findByIdAndUpdate(user._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.findByIdAndUpdate(user._id, null);
      return res.status(204).send("exit successfully");
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      const user = await userModel.findOne(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      throw new UnauthorizedError("Not authorized");
    }
  }

  validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }

  validateLogin(req, res, next) {
    const loginRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validateRezult = loginRules.validate(req.body);
    if (validateRezult.error) {
      return res.status(400).send(validateRezult.error);
    }
    next();
  }
}

module.exports = new UsersController();
