import {Router} from 'express';

import {
  register,
  resendOTP,
  verifyOtp,
  login,
  refreshToken,
  logoutUser,
} from '../controllers/auth.controller.js';
import { uploadSingleFile } from '../middlewares/multer.middleware.js';
import {
  registerValidation,
  loginValidation,
  resendOtpValidation,
  verifyOtpValidation,
  refreshTokenValidation
} from '../validations/index.js';

export const authRouter = Router();

authRouter.post('/register', registerValidation, uploadSingleFile, register);
authRouter.post('/resend-otp', resendOtpValidation, resendOTP);
authRouter.post('/verify-otp', verifyOtpValidation, verifyOtp);
authRouter.post('/login', loginValidation, login);
authRouter.post('/refresh-token', refreshTokenValidation, refreshToken);
authRouter.post('/logout', logoutUser);