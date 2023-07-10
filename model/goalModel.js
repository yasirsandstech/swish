
import mongoose from "mongoose";

const goalSchema=new mongoose.Schema({


authId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"auth",
    required:true
},

activityPerWeek:{
    type:Date,
    required:true
},

shotEachWeek:{
    type: Number,
    required: true,
},
freeThrowEachWeek: {
    type: Number,
    required: true,
  },

})

const goalModel=mongoose.model('goals',goalSchema);

export default goalModel;