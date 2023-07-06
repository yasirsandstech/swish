import express from 'express';
import * as userController from '../controller/authController.js';
export const authRouter=express.Router();
import auth from '../middleware/auth.js';

//register router
authRouter.post("/userRegister",userController.userRegister);

//login router

authRouter.post("/userLogin",userController.userLogin);


//update profile router

authRouter.post("/updateProfile",auth,userController.updateProfile);


authRouter.post("/forgetPassword",userController.forgetPassword);
