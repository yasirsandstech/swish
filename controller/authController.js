import authModel from "../model/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handleMultiPartData } from "../utils/multiPartData.js";
import { sendEmails } from "../utils/sendEmail.js";
import { randomInt } from "crypto";
import otpModel from '../model/otpModel.js'
//user register

export const userRegister = async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "full name not provide",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email not provide",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password not provide",
      });
    }

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "mobileNumber not provide",
      });
    }
    //check user already exist

    const userFind = await authModel.findOne({ email: email });

    if (userFind) {
      return res.status(200).json({
        message: "user already exists",
        success: false,
      });
    }

    //create user

    const createUser = await authModel({
      fullName,
      email,
      password: bcrypt.hashSync(password, 10),
      mobileNumber,
    });

    //save user

    const saveUser = await createUser.save();

    if (!saveUser) {
      return res.status(400).json({
        success: false,
        message: "user not create",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user save successfully",
      data: saveUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//user login

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email not provide",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: true,
        message: "password not provide",
      });
    }

    const user = await authModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "email not found",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "please enter correct password",
      });
    }

    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //save token

    user.userToken = token;
    await user.save();

    const profile = { ...user._doc, userToken: token };
    return res.status(200).json({
      success: true,
      message: "user login successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};




//forget password


export const forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await authModel.findOne({ email: email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "email not found",
        });
      }
  
      const OTP = randomInt(10000, 99999);

   // Create a new OTP document
   const newOTP = new otpModel({
    otpKey: OTP,
    otpUsed: false,
  });

  // Save the new OTP document
  const savedOTP = await newOTP.save();

  // Assign the OTP document reference to the user's otpEmail field
  user.otpEmail = savedOTP._id;
  await user.save();
    
      sendEmails(user.email, "Code sent successfully", `<h5>Your code is ${OTP}</h5>`);
  
      return res.status(200).json({
        success: true,
        message: "Code sent successfully",
        data: OTP
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

//verify otp

export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;
 
      const user=await authModel.findOne({email:email});

      if(!user){
        return res.status(400).json({
            success: false,
            message: "user not found",
          });
      }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
}


//profile update 

export const updateProfile=[


handleMultiPartData.fields([
    {
      name: "Image",
      maxCount: 1,
    },
  ]),




async(req,res)=>{
    try {
        const {fullName,Image}=req.body;

        const {files}=req;
 
        const {user_id}=req.user;
        const filesArray = (filesObj, type) => {
            if (!filesObj[type].length) {
              return "";
            }
            const file = filesObj[type][0]; // Get the first file from the array
            const imagePath = file.path.replace(/\\/g, '/').replace('public/', '');
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fullImagePath = `${baseUrl}/${imagePath}`;
            return fullImagePath;
          };
        const user=authModel.findOne({_id:user_id});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        //update profile

        const updateProfile=await authModel.findByIdAndUpdate(user_id,{
            fullName,
            Image: files && files["Image"]
            ? filesArray(files, "Image")
            : ""
        },{
            new:true
        })

        if(!updateProfile){

            return res.status(400).json({
                success:false,
                message:"profile not update"
            })
        }

        return res.status(200).json({
            success:true,
            message:"profile update successfully",
            data:updateProfile
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message,
          });
    }
}
]