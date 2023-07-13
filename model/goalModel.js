import mongoose from "mongoose";
const goalSchema = new mongoose.Schema({
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    activityEachWeek: {
      type: String,
      required: true,
    },
    shotEachWeek: {
      type: Number,
      required: true,
    },
    freeThrowEachWeek: {
      type: String, // Store as a string
      required: true,
      validate: {
        validator: function (value) {
          // Validate percentage format (e.g., "70%")
          return /^\d+%$/.test(value);
        },
        message: "Invalid percentage format",
      },
    },
    createdAt: {
      type: Date,
      default: function() {
        const currentTime = new Date();
        const duration = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
        const desiredTime = new Date(currentTime.getTime() - duration);
        return desiredTime;
      },
      
    },


  });
  
  const goalModel = mongoose.model("goals", goalSchema);
  
  export default goalModel;
  