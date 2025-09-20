import bcrypt from "bcrypt";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";

import User from "../db/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

// FIND USER
export const findUser = (query) =>
  User.findOne({
    where: query,
  });

// REGISTER
export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const normalizedEmail = payload.email.trim().toLowerCase();
  const avatarURL = gravatar.url(
    normalizedEmail,
    {
      s: "250",
      r: "pg",
      d: "identicon",
    },
    true
  );

  return User.create({
    ...payload,
    email: normalizedEmail,
    password: hashPassword,
    avatarURL,
  });
};

// LOGIN
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const tokenPayload = {
    id: user.id,
  };

  const token = createToken(tokenPayload);
  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

// LOGOUT
export const logoutUser = async (user) => {
  await user.update({ token: null });
  return;
};

// UPDATE AVATAR
export const updateUserAvatar = async (userId, file) => {
  if (!file) throw HttpError(400, "Avatar file is required");

  const avatarsDir = path.resolve("public", "avatars");
  await fs.mkdir(avatarsDir, { recursive: true });

  const tmpPath = file.path;
  const filename = file.filename;
  const finalPath = path.join(avatarsDir, filename);

  try {
    await fs.rename(tmpPath, finalPath);
  } catch (e) {
    try {
      await fs.unlink(tmpPath);
    } catch {}
    throw e;
  }

  const avatarURL = `/avatars/${filename}`;

  await User.update({ avatarURL }, { where: { id: userId } });

  const user = await User.findByPk(userId, {
    attributes: ["email", "username", "subscription", "avatarURL"],
  });

  return user.get ? user.get({ plain: true }) : user;
};
