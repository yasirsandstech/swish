import mongoose from "mongoose";
const activitySchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "goals",
    required: true,
  },
  goalCreatedAt: {
    type: Date,
    required: true,
  },
});

const activityModel = mongoose.model("activityAnalytics", activitySchema);

export default activityModel;