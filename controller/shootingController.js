import activityAnalyticsModel from "../model/activityAnalyticsModel.js";
import authModel from "../model/authModel.js";
import shootingGameModel from '../model/shootingGameModel.js';

//play shooting 


export const playShootingGame=async(req,res)=>{
    try {
        const {user_id}=req.user;

        const userfind=await authModel.findById(user_id);

        if(!userfind){
            res.status(400).json({
                success: false,
                message: "user not found",
              });
        }
        
const {gameType,Method,authId,makes,attempts,goalId }=req.body;

//play shooting game

const shootinggame=new shootingGameModel({
    gameType,
    Method,
    authId:user_id,
    makes,
    attempts
})

//save shooting game

const saveShootingGame=await shootinggame.save();


if(!saveShootingGame){
    return res.status(400).json({
        success:false,
        message:"shooting game not save"
    })
}

 // Calculate average of makes and attempts
 const averageFreeThrow = (makes + attempts) / 2;


 // Create activity analytics entry
 const activityAnalyticsEntry = new activityAnalyticsModel({
    authId: user_id,
    goalId: goalId, // Provide the appropriate goal ID based on your implementation
    shortAttempted: attempts,
    workOutTime: new Date(),
    FreeThrow: averageFreeThrow,
  });
  const savedActivityAnalyticsEntry = await activityAnalyticsEntry.save();
return res.status(200).json({
    success:true,
    message:"shooting game save successfully",
    data: {
        shootingGame: saveShootingGame,
        activityAnalytics: savedActivityAnalyticsEntry,
      },
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

export const getShootingGame=async(req,res)=>{
    try {
        const {user_id}=req.user;

        const userfind=await authModel.findById(user_id).populate('');

        if(!userfind){
            res.status(400).json({
                success: false,
                message: "user not found",
              });
        }
      
        const getshooting=await shootingGameModel.find({authId:user_id});

        if(!getshooting){
            return  res.status(400).json({
                success: false,
                message: "shooting not found",
                
              });
        }

        return res.status(200).json({
            success:true,
            message:"shooting found successfully",
            data:getshooting
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

export const updateShootingGame=async(req,res)=>{
    try {
        const {user_id}=req.user;
        const {id }=req.params;
        
        const {makes,attempts}=req.body;
        const userfind=await authModel.findById(user_id);

        if(!userfind){
            res.status(400).json({
                success: false,
                message: "user not found",
              });
        }

        const updateshooting=await shootingGameModel.findByIdAndUpdate(id,{
         makes,
         attempts
        },{new:true});

        if(!updateshooting){
            return res.status(400).json({
                success:false,
                message:"shooting not update"
            })
        }

        return res.status(200).json({
            success:true,
            message:"shooting update successfully",
            data:updateshooting
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