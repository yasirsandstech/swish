import activityAnalyticsModel from "../model/activityAnalyticsModel.js";
import authModel from "../model/authModel.js";
import goalModel from "../model/goalModel.js";
import shootingGameModel from '../model/shootingGameModel.js';
import { handleMultiPartData } from "../utils/multiPartData.js";



//play shooting 
  
export const playShootingGame = [
    handleMultiPartData.fields([
      {
        name: "userVoice",
        maxCount: 1,
      },
    ]),
  
    async (req, res) => {
      try {
        const { user_id } = req.user;
        const { files } = req;
        const filesArray = (filesObj, type) => {
          if (!filesObj[type] || !filesObj[type].length) {
            return "";
          }
          const file = filesObj[type][0]; // Get the first file from the array
          const imagePath = file.path.replace(/\\/g, "/").replace("public/", "");
          const baseUrl = `${req.protocol}://${req.get("host")}`;
          const fullImagePath = `${baseUrl}/${imagePath}`;
          return fullImagePath;
        };
  
        const userfind = await authModel.findById(user_id);
  
        if (!userfind) {
          return res.status(400).json({
            success: false,
            message: "User not found",
          });
        }
  
        const { gameType, Method, authId, goalId } = req.body;
        let makes, attempts;
        let userVoice = "";
  

        //check goal id

const goal=await goalModel.findById(goalId);

        if(!goal){
            return res.status(400).json({
                success:false,
                message:"goal id not found"
            })

        }

        // Play shooting game
        if (Method === "SingleShotEntry") {
          makes = req.body.makes;
          attempts = req.body.attempts;
        } else if (Method === "BulkEntry") {
          if (
            req.body.makes === undefined ||
            req.body.attempts === undefined
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Makes and attempts must be passed in the body when the method is BulkEntry",
            });
          }
          makes = Number(req.body.makes);
          attempts = Number(req.body.attempts);
        } else if (Method === "VoiceCommand") {
          if (!files || !files.userVoice || !files.userVoice.length) {
            return res.status(400).json({
              success: false,
              message:
                "Voice file must be uploaded when the method is VoiceCommand",
            });
          }
          userVoice = filesArray(files, "userVoice");
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid game method",
          });
        }
  
        const shootinggame = new shootingGameModel({
          gameType,
          Method,
          authId: user_id,
          makes,
          attempts,
          userVoice,
          goalId
        });
  
        // Save shooting game
        const saveShootingGame = await shootinggame.save();
  
        if (!saveShootingGame) {
          return res.status(400).json({
            success: false,
            message: "Failed to save shooting game",
          });
        }
  
        if (
          (Method === "SingleShotEntry" || Method === "BulkEntry") &&
          (isNaN(makes) || isNaN(attempts))
        ) {
          return res.status(400).json({
            success: false,
            message: "Makes and attempts must be numbers",
          });
        }
  
        // Calculate average of makes and attempts
        let averageFreeThrow;
        if (Method === "SingleShotEntry" || Method === "BulkEntry") {
          averageFreeThrow = (makes + attempts) / 2;
        }
  
        // Create activity analytics entry for SingleShotEntry and BulkEntry
        let savedActivityAnalyticsEntry;
        if (Method === "SingleShotEntry" || Method === "BulkEntry") {
          const activityAnalyticsEntry = new activityAnalyticsModel({
            authId: user_id,
            shootingId:saveShootingGame._id,
            // goalId: goalId, // Provide the appropriate goal ID based on your implementation
            // shortAttempted: attempts,
            workOutTime: new Date(),
            // FreeThrow: averageFreeThrow,
          });
          savedActivityAnalyticsEntry = await activityAnalyticsEntry.save();
        }
  
        // Create activity analytics entry for VoiceCommand
        let savedActivityAnalyticsVoiceEntry;
        if (Method === "VoiceCommand") {
          const activityAnalyticsVoiceEntry = new activityAnalyticsModel({
            authId: user_id,
            shootingId:saveShootingGame._id,
            // goalId: goalId, // Provide the appropriate goal ID based on your implementation
            // shortAttempted: attempts,
            workOutTime: new Date(),
            // FreeThrow: averageFreeThrow,
            userVoiceLink: userVoice, // Store the file link in the userVoiceLink field
          });
          savedActivityAnalyticsVoiceEntry = await activityAnalyticsVoiceEntry.save();
        }
  
        return res.status(200).json({
          success: true,
          message: "Shooting game saved successfully",
          data: {
            shootingGame: saveShootingGame,
            activityAnalytics: savedActivityAnalyticsEntry,
            activityAnalyticsVoice: savedActivityAnalyticsVoiceEntry,
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
    },
  ];
  
  
  

// export const getShootingGame=async(req,res)=>{
//     try {
//         const {user_id}=req.user;

//         const userfind=await authModel.findById(user_id).populate('');

//         if(!userfind){
//             res.status(400).json({
//                 success: false,
//                 message: "user not found",
//               });
//         }
      
//         const getshooting=await shootingGameModel.find({authId:user_id});

//         if(!getshooting){
//             return  res.status(400).json({
//                 success: false,
//                 message: "shooting not found",
                
//               });
//         }

//         return res.status(200).json({
//             success:true,
//             message:"shooting found successfully",
//             data:getshooting
//         })

//     } catch (error) {
//         console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "internal server error",
//       error: error.message,
//     });
//     }
// }

// export const updateShootingGame=async(req,res)=>{
//     try {
//         const {user_id}=req.user;
//         const {id }=req.params;
        
//         const {makes,attempts}=req.body;
//         const userfind=await authModel.findById(user_id);

//         if(!userfind){
//             res.status(400).json({
//                 success: false,
//                 message: "user not found",
//               });
//         }

//         const updateshooting=await shootingGameModel.findByIdAndUpdate(id,{
//          makes,
//          attempts
//         },{new:true});

//         if(!updateshooting){
//             return res.status(400).json({
//                 success:false,
//                 message:"shooting not update"
//             })
//         }

//         return res.status(200).json({
//             success:true,
//             message:"shooting update successfully",
//             data:updateshooting
//         })
//     } catch (error) {
//         console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "internal server error",
//       error: error.message,
//     });
//     }
// }

