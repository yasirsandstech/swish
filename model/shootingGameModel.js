import mongoose from "mongoose";

const shootingGameSchema=new mongoose.Schema({

    authId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"auth",
        required:true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true,
      },
    gameType:{
        type:String,
        enum:['Game','Practice'],
        required:true
    },
    Method:{
        type:String,
        enum:['SingleShotEntry','BulkEntry','VoiceCommand'],
        required:true
    },
    makes: {
        type: Number,
        default: 0,
      },
    attempts: {
        type: Number,
        default: 0,
      },
    userVoice:{
        type:String,
        default:""
    }  

});

const shootingGameModel=mongoose.model('shootinggame',shootingGameSchema);

export default shootingGameModel;