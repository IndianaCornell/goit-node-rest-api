import express from "express";

import upload from "../middlewares/upload.js";

import authenticate from "../middlewares/authenticate.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  verifySchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  validateBody(registerSchema),
  authControllers.registerController
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  authControllers.loginController
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatarController
);

authRouter.get("/verify/:verificationToken", authControllers.verifyController);

authRouter.post("/verify", validateBody(verifySchema), authControllers.resendVerifyController);

authRouter.get("/current", authenticate, authControllers.getCurrentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

export default authRouter;
