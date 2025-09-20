import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserAvatar,
} from "../services/authServices.js";

// REGISTER
export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const { email, username, subscription, avatarURL } = user.get
      ? user.get({ plain: true })
      : user;
    res.status(201).json({ email, username, subscription, avatarURL });
  } catch (err) {
    next(err);
  }
};

// LOGIN
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

// GET USER
export const getCurrentController = async (req, res) => {
  const { email, username, id } = req.user;

  res.json({
    email,
    username,
    id,
  });
};

// LOGOUT UEST
export const logoutController = async (req, res) => {
  await logoutUser(req.user);
  res.status(204).send();
};

// UPDATE AVATAR
export const updateAvatarController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await updateUserAvatar(id, req.file);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export default {
  loginController,
  registerController,
  getCurrentController,
  logoutController,
  updateAvatarController,
};
