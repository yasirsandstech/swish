import activityAnalyticsModel from '../model/activityAnalyticsModel.js';
import authModel from '../model/authModel.js';
import goalModel from '../model/goalModel.js';


//create goals


export const createGoals=async(req,res)=>{
    try {

        const {user_id}=req.user;
        const {activityEachWeek,shotEachWeek,freeThrowEachWeek}=req.body;


        console.log(user_id);
        //user find

        const userfind=await authModel.findById(user_id);

        if(!userfind){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        //create goals

        const creategoals=new goalModel({
            authId:user_id,
            activityEachWeek,
            shotEachWeek,
            freeThrowEachWeek
        })

        //save goals

        const savegoals=await creategoals.save();

        console.log(savegoals._id);
        if(!savegoals){
            return res.status(400).json({
                success:false,
                message:"goals not save"
            })
        }

        //create entry in analytics model

        const analyticsEntry= new activityAnalyticsModel({
            goalId:savegoals._id,
            authId:user_id,
            goalCreatedAt:savegoals.createdAt
        })

        //save goal id in analytics model

        const saveAnalyticsEntry=await analyticsEntry.save();

        console.log(savegoals._id);

        if(!saveAnalyticsEntry){
            return res.status(400).json({
                success:false,
                message:"failed to save analytic entry",
                
            })
        }
        return res.status(200).json({
            success:true,
            message:"goal save successfully",
            data:savegoals,
            analytics:saveAnalyticsEntry
        })
 
        
    } catch (error) {
        console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
    }
}

//get goals

export const getGoals=async(req,res)=>{
    try {
        const {user_id}=req.user;
        const userfind=await authModel.findById(user_id);

        if(!userfind){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        const getgoals=await goalModel.find();

        console.log(getgoals);
        if(!getgoals){
            return res.status(400).json({
                success:false,
                message:"goals not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"goals found successfully",
            data:getgoals
        })
       
    } catch (error) {
        console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
    }
}

//update goals

export const updateGoals=async(req,res)=>{
    try {
        const {activityEachWeek,shotEachWeek,freeThrowEachWeek}=req.body;
        const {user_id}=req.user;
        const {id}=req.params;
        const userfind=await authModel.findById(user_id);

        if(!userfind){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        
        //update goals

        const updategoals=await goalModel.findByIdAndUpdate(id,{
            activityEachWeek,
            shotEachWeek,
            freeThrowEachWeek
        },{
            new:true
        });
        if(!updategoals){
            return res.status(400).json({
                success:false,
                message:"goals not update"
            })
        }

        return res.status(200).json({
            success:true,
            message:"goals update successfully",
            data:updategoals
        })
    } catch (error) {
        console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
    }
}

export const getAnalytics=async(req,res)=>{
    try {
        const {user_id}=req.user;

        const userfind=await authModel.findById(user_id);

        if(!userfind){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        //find analytics

        const getanalytics=await activityAnalyticsModel.find().populate("goalId");

        if(!getanalytics){
            return res.status(200).json({
                success:true,
                message:"analytics not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"analytics found successfully",
            data:getanalytics
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "internal server error",
          error: error.message,
        });
    }
}  
    