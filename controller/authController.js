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
    const { fullName, email, password, mobileNumber, userType, DateOfBirth, CourtSize, parentId } = req.body;

    // ... (input validation code)

    // Create the user
    const createUser = await authModel({
      fullName,
      email,
      password: bcrypt.hashSync(password, 10),
      mobileNumber,
      userType,
      DateOfBirth,
      CourtSize,
      parentId, // Assign the parentId field
      isActive: userType === 'child' ? true : false, // Set isActive to true for child user

    });

    // Save the user
    const saveUser = await createUser.save();
    if (!saveUser) {
      return res.status(400).json({
        success: false,
        message: "user not created",
      });
    }

    // If the user is a child, assign the parent's ID to the parentUser field
    if (userType === "child") {
      const parentUser = await authModel.findById(parentId);
      if (!parentUser) {
        return res.status(400).json({
          success: false,
          message: "Parent user not found",
        });
      }
      saveUser.parentUser = parentUser._id;
    
      await saveUser.save();
    }

    return res.status(200).json({
      success: true,
      message: "user saved successfully",
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

    const userType = user.userType;

    // Apply userType validation
    if (userType !== "parent" && userType !== "child") {
      return res.status(403).json({
        success: false,
        message: "Invalid user type",
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
         console.log(otp);
         
      const user=await authModel.findOne({email:email}).populate("otpEmail");

      if(!user){
        return res.status(400).json({
            success: false,
            message: "user not found",
          });
      }

      const OTP=user.otpEmail;

      if(!OTP){
        return res.status(400).json({
          success: false,
          message: "otp not found",
        });
      }

     else if(OTP.otpUsed){
        return res.status(400).json({
          success: false,
          message: "otp already used",
        });
      }

      if (OTP.otpKey !== otp) {
        console.log(OTP.otpKey);
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
      
      //otp expire after 1h
    const currentTime = new Date();
    const OTPTime = OTP.createdAt;
    const diff = currentTime.getTime() - OTPTime.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes > 60) {
      return res.status(400).json({
        success: false,
        message: "OTP expire",
      });
    }

    //generate token

    const token=jwt.sign({user_id:user._id},process.env.SECRET_KEY,{
      expiresIn:"1d"
    });

    //token save

    user.userToken=token;
    await user.save();

    OTP.otpUsed=true;
    await OTP.save();

    user.otpVerified=true;
    user.otpEmail=null;
    await user.save();

    const profile={...user._doc,userToken:token};

    return res.status(200).json({
      success:true,
      message:"OTP verified successfully",
      data:profile
    })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }


}


//reset password

export const resetPassword=async(req,res)=>{
  try {
    const {password}=req.body;
    const {user_id}=req.user;


    console.log(user_id);
    const user=await authModel.findById(user_id);

    if(!user){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })
    }

    const userResetPassword=await authModel.findByIdAndUpdate(user_id,{
      password:bcrypt.hashSync(password,10)
    },
    {
      new:true
    })
    if(!userResetPassword){
      return res.status(400).json({
        success:false,
        message:"password not reset"
      })
    }

    return res.status(200).json({
      success:true,
      message:"password reset successfully",
      data:userResetPassword
    })
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

//invite child

export const inviteChild = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await authModel.findById(user_id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const { link, email } = req.body;

    const childUser = await authModel.findOne({ email: email });
    if (childUser) {
      return res.status(400).json({
        success: false,
        message: "Child user already exists",
      });
    }

    sendEmails(
      email,
      "Invitation link sent successfully",
      `<h5>Your invitation link is ${link}</h5>`
    );

    return res.status(200).json({
      success: true,
      message: "Invitation link sent successfully",
      link: link,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




