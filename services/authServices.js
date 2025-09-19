import bcrypt from "bcrypt";

import User from "../db/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
};

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

export const logoutUser = async (user) => {
  await user.update({ token: null });
  return;
};
