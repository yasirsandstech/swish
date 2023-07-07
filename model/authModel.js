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
  userType: {
    type: String,
    enum: ["parent", "child"],
    required: true,
  },
 
  parentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
  },
  isActive:{
    type:Boolean,
    default:false
  },
  DateOfBirth:{
    type:Date,
    required: function() {
      return this.userType === 'child';
    },
  },
  CourtSize:{
    type:String,

    enum:[
      'Youth-Middle-High-School',
      'Women-College',
      'Mens-College',
      'NBA'
  ],
  required: function() {
    return this.userType === 'child';
  },
  },




});

const authModel = mongoose.model("auth", authSchema);

export default authModel;
