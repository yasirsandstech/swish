import mongoose from "mongoose";

const shootingGameSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    required: true,
  },
  gameType: {
    type: String,
    enum: ["Game", "Practice"],
    required: true,
  },
  Method: {
    type: String,
    enum: ["SingleShotEntry", "BulkEntry", "VoiceCommand"],
    required: true,
  },
  makes: {
    type: Number,
  },
  attempts: {
    type: Number,
  },
  shorts: {
    type: String,
    required:false,
    validate: {
        validator: function (value) {
          // Validate percentage format (e.g., "70%")
          return /^\d+%$/.test(value);
        },
        message: "Invalid percentage format",
      },
  },
  freeThrow: {
    type: String, // Store as a string
    required: false,
    validate: {
      validator: function (value) {
        // Validate percentage format (e.g., "70%")
        return /^\d+%$/.test(value);
      },
      message: "Invalid percentage format",
    },
  },
  userVoice: {
    type: String,
    default: "",
  },
});

const shootingGameModel = mongoose.model("shootinggame", shootingGameSchema);

export default shootingGameModel;
