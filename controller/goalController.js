import activityAnalyticsModel from '../model/activityAnalyticsModel.js';
import authModel from '../model/authModel.js';
import goalModel from '../model/goalModel.js';
import moment from 'moment';

//create goals


export const createGoals = async (req, res) => {
    try {
      const { user_id } = req.user;
      const { activityEachWeek, shotEachWeek, freeThrowEachWeek } = req.body;
  
      console.log(user_id);
  
      // Find user
      const userfind = await authModel.findById(user_id);
      if (!userfind) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
  
      
      console.log("activityEachWeek (received):", activityEachWeek);
      console.log("activityEachWeek (converted):", moment.utc(activityEachWeek).toDate());
      const creategoals = new goalModel({
        authId: user_id,
        activityEachWeek,
        shotEachWeek,
        freeThrowEachWeek
      });
  
      // Save goals
      const savegoals = await creategoals.save();
  
      console.log(savegoals._id);
      if (!savegoals) {
        return res.status(400).json({
          success: false,
          message: "Failed to save goals",
        });
      }
  
      // Create entry in analytics model
      const analyticsEntry = new activityAnalyticsModel({
        goalId: savegoals._id,
        authId: user_id,
        goalCreatedAt: savegoals.createdAt
      });
  
      // Save goal ID in analytics model
      const saveAnalyticsEntry = await analyticsEntry.save();
  
      console.log(savegoals._id);
  
      if (!saveAnalyticsEntry) {
        return res.status(400).json({
          success: false,
          message: "Failed to save analytic entry",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Goal saved successfully",
        data: savegoals,
        analytics: saveAnalyticsEntry,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  

//get goals

export const getAllGoals = async (req, res) => {
  try {
    const { user_id } = req.user;
    const userfind = await authModel.findById(user_id);

    if (!userfind) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userGoals = await goalModel.find({ authId: user_id });

    console.log(userGoals);
    if (!userGoals) {
      return res.status(400).json({
        success: false,
        message: "Goals not found",
      });
    }

    let totalShots = 0;
    let totalWorkoutsTime = 0;
    let totalFreeThrows = 0;

    // Calculate total goals

    userGoals.forEach((goal) => {
      totalShots += goal.shotEachWeek;
      
      const durationString = goal.activityEachWeek;
      const durationParts = durationString.split(" "); // Split the string into number and unit parts
      const durationValue = parseInt(durationParts[0]); // Extract the numerical value
      const durationUnit = durationParts[1]; // Extract the unit

      if (!isNaN(durationValue)) {
        if (durationUnit === "minutes") {
          totalWorkoutsTime += durationValue; // Add the duration value in minutes
        } else if (durationUnit === "hours") {
          totalWorkoutsTime += durationValue * 60; // Convert hours to minutes and add to totalWorkoutsTime
        }
      }

      const freeThrowPercentage = parseInt(goal.freeThrowEachWeek);

      if (!isNaN(freeThrowPercentage)) {
        totalFreeThrows += freeThrowPercentage;
      }
    });

    // Limit totalFreeThrows to 100 if it exceeds 100
    totalFreeThrows = Math.min(totalFreeThrows, 100);

    const totalHours = Math.floor(totalWorkoutsTime / 60);
    const totalMinutes = totalWorkoutsTime % 60;

    return res.status(200).json({
      success: true,
      message: "All Goals Found Successfully",
      data: {
        totalShots,
        totalWorkoutsTime: `${totalHours} hours ${totalMinutes} minutes`,
        totalFreeThrows: `${totalFreeThrows} %`,
      }, 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


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
            message:"Goals Update Successfully",
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

//get analytics


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
            message:"Analytics Found Successfully",
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
    