import express from 'express';
import * as userController from '../controller/authController.js';
export const authRouter=express.Router();
import auth from '../middleware/auth.js';0

//register router
authRouter.post("/userRegister",userController.userRegister);

//login router

authRouter.post("/userLogin",userController.userLogin);


//update profile router

authRouter.post("/updateProfile",auth,userController.updateProfile);

//forget password router
authRouter.post("/forgetPassword",userController.forgetPassword);

//verify otp router
authRouter.post("/verifyOtp",userController.verifyOtp);

//reset password router
authRouter.post("/resetPassword",auth,userController.resetPassword);


//invitation child router

authRouter.post("/inviteChild",auth,userController.inviteChild);
