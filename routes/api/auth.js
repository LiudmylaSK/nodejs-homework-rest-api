const express = require("express");

const authCtrl = require("../../controllers/auth");

const authSchemas = require("../../schemas/authSchemas");

const { validateBody, authenticate, upload } = require("../../middlewares");

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authSchemas.userRegisterSchema),
  authCtrl.register
);

authRouter.get("/verify/:verificationToken", authCtrl.verifyEmail);

authRouter.post(
  "/verify",
  validateBody(authSchemas.emailSchema),
  authCtrl.resendVerifyEmail
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

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authCtrl.updateAvatar
);

module.exports = authRouter;
