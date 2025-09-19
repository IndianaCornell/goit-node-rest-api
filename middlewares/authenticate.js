import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";
import { verifyToken } from "../helpers/jwt.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Authorization header missing"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(HttpError(401, "Authorization header must have bearer type"));
  }

  const { payload, error } = verifyToken(token);

  if (error) {
    return next(HttpError(401, "Unauthorized"));
  }

  const user = await findUser({ id: payload.id });

  if (!user || user.token !== token) {
    return next(HttpError(401, "Unauthorized"));
  }

  req.user = user;
  next();
};
export default authenticate;
