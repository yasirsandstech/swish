import mongoose from "mongoose";

const parentDashboardSchema=new mongoose.Schema({

auth:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"auth"
},
shooting:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"shooting"
},
activity:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"activity"
},
goal:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"activity"
},
BuiltInGuide:{
    type:String,
    default:""
}

});

const parentDashboardModel=mongoose.model('parent',parentDashboardSchema);

export default parentDashboardModel;