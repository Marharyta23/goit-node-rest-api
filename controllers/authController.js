import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/users.js";
import { registerUserSchema, loginUserSchema } from "../schemas/usersSchema.js";

async function register(req, res, next) {
  try {
    const user = req.body;

    const { error } = registerUserSchema.validate(user, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const isUser = await User.findOne({ email: user.email });

    if (isUser !== null) {
      return res.status(409).send({
        message: "Email in use",
      });
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    const result = await User.create({
      email: user.email,
      password: passwordHash,
      subscription: user.subscription,
    });

    res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = req.body;

    const { error } = loginUserSchema.validate(user, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const isUser = await User.findOne({ email: user.email });

    if (isUser === null) {
      return res.status(401).send({
        message: "Email or password is wrong",
      });
    }

    const isMatch = await bcrypt.compare(user.password, isUser.password);

    if (isMatch === false) {
      return res.status(401).send({
        message: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(isUser._id, { token });

    return res.status(200).send({
      token,
      user: {
        email: isUser.email,
        subscription: isUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const currentUser = await User.findById(req.user.id);

    res.status(200).send({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, current };
