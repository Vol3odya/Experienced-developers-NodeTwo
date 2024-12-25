import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";

import { authRegisterSchema, authLoginSchema, requestResetEmailSchema, loginWithGoogleOAuthSchema } from "../validation/auth.js";

import { resetPasswordSchema } from '../validation/auth.js';
import { upload } from '../middlewares/multer.js';


const authRouter = Router();

authRouter.post("/signup", upload.single('photo'), validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));
authRouter.post("/signin", validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));
authRouter.post("/refresh", ctrlWrapper(authControllers.refreshSessionController));
authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));
authRouter.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrlWrapper(authControllers.requestResetEmailController));
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController),
);
authRouter.get('/get-oauth-url', ctrlWrapper(authControllers.getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(authControllers.loginWithGoogleController),
);



export default authRouter;
