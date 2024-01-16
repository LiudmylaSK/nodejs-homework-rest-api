const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      if (Object.keys(req.body).length === 0) {
        return next(HttpError(400, "missing fields"));
      } else {
        return next(HttpError(400, error.message));
      }
    }

    next();
  };

  return func;
};

const isEmptyBodyFavorite = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "missing field favorite"));
  }
  next();
};

module.exports = { validateBody, isEmptyBodyFavorite };
