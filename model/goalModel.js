import mongoose from "mongoose";
const goalSchema = new mongoose.Schema({
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    activityEachWeek: {
      type: Date,
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
      default: Date.now,
    },


  });
  
  const goalModel = mongoose.model("goals", goalSchema);
  
  export default goalModel;
  