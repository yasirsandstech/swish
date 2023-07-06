import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  Image:{
    type: String,
    default: "",
  },
  otpEmail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "otp",
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
});

const authModel = mongoose.model("auth", authSchema);

export default authModel;
