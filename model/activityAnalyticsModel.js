import mongoose from "mongoose";

const activityAnalyticsSchema=new mongoose.Schema({

    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth",
        required: true,
      },
      shootingId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"shootinggame",
        required: true,
      },
    // shortAttempted:{
    //     type: Number,
    //     // required: true,
    // },
    workOutTime:{
        type:Date,
        // required: true,
    },
    // FreeThrow:{
    //     type: Number,
    //     // required: true,
    // },
    userVoiceLink: {
        type: String, // Assuming the file link is a string
      },  


});

const activityAnalyticsModel=mongoose.model('activityAnalytics',activityAnalyticsSchema);

export default activityAnalyticsModel;