import fs from "node:fs/promises";
import path from "node:path";
import crypto from 'node:crypto'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import User from "../models/users.js";
import { registerUserSchema, loginUserSchema, verifyEmail } from "../schemas/usersSchema.js";
import mail from '../mail.js'

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
    const avatar = gravatar.url(user.email);
    const verificationToken =  crypto.randomUUID()

    mail.sendMail({
      to: user.email,
      from: "margarita.slobodchyk@gmail.com",
      subject: "Welcome to ContactBook",
      html: `Please click the following <a href='http://localhost:3000/api/users/verify/${verificationToken}'>link</a> to confirm your email.`,
      text: `Please open the following link to confirm your email: http://localhost:3000/api/users/verify/${verificationToken}`
    })

    const result = await User.create({
      email: user.email,
      password: passwordHash,
      subscription: user.subscription,
      avatarURL: avatar,
      verificationToken,
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

    if (isUser.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
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

async function avatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "no image detected" });
    }

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(req.user.id, {
      avatarURL: `/avatars/${req.file.filename}`,
    });

    res.status(200).send({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (user === null) {
    return res.status(404).send({
      message: 'User not found'
    });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).send({
    message: 'Verification successful',
  });
}

async function verifyByEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({message: "missing required field email"});
  }

  const user = await User.findOne({email});

  if (user === null) {
    return res.status(401).send({ message: "Not authorized" }); 
  }

  if (user.verify === true) {
    return res.status(400).send({
      message: "Verification has already been passed"
    })
  }

  mail.sendMail({
    to: email,
    from: "margarita.slobodchyk@gmail.com",
    subject: "Welcome to ContactBook",
    html: `Please click the following <a href='http://localhost:3000/api/users/verify/${user.verificationToken}'>link</a> to confirm your email.`,
    text: `Please open the following link to confirm your email: http://localhost:300/api/users/verify/${user.verificationToken}`
  })

  res.status(200).send({
    message: "Verification email sent"
  });
}
export default { register, login, logout, current, avatar, verify, verifyByEmail };
