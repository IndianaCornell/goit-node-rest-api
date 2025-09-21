import bcrypt from "bcrypt";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";

import User from "../db/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken, verifyToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

const createVerifyEmail = ({ verificationToken, email }) => {
  return {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Verify email</a>`,
  };
};
// FIND USER
export const findUser = (query) =>
  User.findOne({
    where: query,
  });

// REGISTER
export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationToken = nanoid();
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
  const newUser = await User.create({
    ...payload,
    email: normalizedEmail,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = createVerifyEmail({
    verificationToken,
    email: payload.email,
  });

  await sendEmail(verifyEmail);
  return newUser;
};

// LOGIN
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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

//

// VERIFY

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });
  if (!user) throw HttpError(401, "User not found or already verified");
  await user.update({ verify: true, verificationToken: null });
};

// RESEND VERIFY

export const resendVerifyUser = async ({ email }) => {
  const user = await findUser({ email });
  if (!user || user.verify)
    throw HttpError(401, "User not found or email already verified");
  const verifyEmail = createVerifyEmail({
    verificationToken: user.verificationToken,
    email,
  });

  await sendEmail(verifyEmail);
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
