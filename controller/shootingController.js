import activityAnalyticsModel from "../model/activityAnalyticsModel.js";
import authModel from "../model/authModel.js";
import goalModel from "../model/goalModel.js";
import shootingGameModel from "../model/shootingGameModel.js";
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

      const goal = await goalModel.findById(goalId);

      if (!goal) {
        return res.status(400).json({
          success: false,
          message: "goal id not found",
        });
      }

      // Play shooting game
      if (Method === "SingleShotEntry") {
        makes = req.body.makes;
        attempts = req.body.attempts;
        const avg = (makes / attempts) * 100;
        const freeThrough = 100 - avg;
        console.log("avg:", avg);
        console.log("freeThrough:", freeThrough);

        const shootinggame = new shootingGameModel({
          gameType,
          Method,
          authId: user_id,
          makes,
          attempts,
          userVoice,
          goalId,
          shorts: `${avg}%`,
          freeThrow: `${freeThrough}%`,
        });

        // // Save shooting game
        const saveShootingGame = await shootinggame.save();

        if (!saveShootingGame) {
          return res.status(400).json({
            success: false,
            message: "Failed to save shooting game",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Shooting game saved successfully",
          data: saveShootingGame
        });
      } else if (Method === "BulkEntry") {
        if (req.body.makes === undefined || req.body.attempts === undefined) {
          return res.status(400).json({
            success: false,
            message:
              "Makes and attempts must be passed in the body when the method is BulkEntry",
          });
        }
        makes = Number(req.body.makes);
        attempts = Number(req.body.attempts);
        const avg = (makes / attempts) * 100;
        const freeThrough = 100 - avg;
        console.log("avg:", avg);
        console.log("freeThrough:", freeThrough);
        const shootinggame = new shootingGameModel({
          gameType,
          Method,
          authId: user_id,
          makes,
          attempts,
          userVoice,
          goalId,
          shorts: `${avg}%`,
          freeThrow: `${freeThrough}%`,
        });

        // // Save shooting game
        const saveShootingGame = await shootinggame.save();

        if (!saveShootingGame) {
          return res.status(400).json({
            success: false,
            message: "Failed to save shooting game",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Shooting game saved successfully",
          data: saveShootingGame
        });
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
        userVoice,
        goalId,
        
      });

      // // Save shooting game
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

  
      return res.status(200).json({
        success: true,
        message: "Shooting game saved successfully",
        data:saveShootingGame
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
