const express = require("express");

const authCtrl = require("../../controllers/auth");

const authSchemas = require("../../schemas/authSchemas");

const { validateBody, authenticate } = require("../../middlewares");

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authSchemas.userRegisterSchema),
  authCtrl.register
);

authRouter.post(
  "/login",
  validateBody(authSchemas.userLoginSchema),
  authCtrl.login
);

authRouter.post("/logout", authenticate, authCtrl.logout);

authRouter.get("/current", authenticate, authCtrl.getCurrent);

authRouter.patch(
  "/",
  authenticate,
  validateBody(authSchemas.userSubscriptionSchema),
  authCtrl.subscription
);

module.exports = authRouter;
