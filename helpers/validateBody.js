import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  return (req, _res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
};

export default validateBody;
