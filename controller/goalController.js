import activityAnalyticsModel from '../model/activityAnalyticsModel.js';
import authModel from '../model/authModel.js';
import goalModel from '../model/goalModel.js';


//create goals


export const createGoals=async(req,res)=>{
    try {

        const {user_id}=req.user;
        const {activityPerWeek,shotEachWeek,freeThrowEachWeek}=req.body;


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
            activityPerWeek,
            shotEachWeek,
            freeThrowEachWeek
        })

        //save goals

        const savegoals=await creategoals.save();

        if(!savegoals){
            return res.status(400).json({
                success:false,
                message:"goals not save"
            })
        }
        return res.status(200).json({
            success:true,
            message:"goal save successfully",
            data:savegoals
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


