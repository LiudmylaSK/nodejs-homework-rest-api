const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const {
  validateBody,
  isEmptyBodyFavorite,
  isValidId,
  authenticate,
} = require("../../middlewares");

const schemas = require("../../schemas/contacts");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addNew);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.updateSchema),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  isEmptyBodyFavorite,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
