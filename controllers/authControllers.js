import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authServices.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const { email, username, subscription } = user.get
      ? user.get({ plain: true })
      : user;
    res.status(201).json({ email, username, subscription });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);
    console.log({ token, user });
    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    return next(err);
  }
};

export const getCurrentController = async (req, res) => {
  const { email, username, id } = req.user;

  res.json({
    email,
    username,
    id,
  });
};

export const logoutController = async (req, res) => {
  await logoutUser(req.user);
  res.status(204).send();
};

export default {
  loginController,
  registerController,
  getCurrentController,
  logoutController,
};
