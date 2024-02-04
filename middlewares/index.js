const { validateBody, isEmptyBodyFavorite } = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const upload = require("./upload");

module.exports = {
  validateBody,
  isValidId,
  isEmptyBodyFavorite,
  authenticate,
  upload,
};
