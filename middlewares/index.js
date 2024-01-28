const { validateBody, isEmptyBodyFavorite } = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");

module.exports = { validateBody, isValidId, isEmptyBodyFavorite, authenticate };
