import mongoose from "mongoose";

const activityAnalyticsSchema=new mongoose.Schema({

    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth",
        required: true,
      },
      goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true,
      },
    shortAttempted:{
        type: Number,
        required: true,
    },
    workOutTime:{
        type:Date,
        required: true,
    },
    FreeThrow:{
        type: Number,
        required: true,
    },  


});

const activityAnalyticsModel=mongoose.model('activityAnalytics',activityAnalyticsSchema);

export default activityAnalyticsModel;