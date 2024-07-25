import mongoose from "mongoose";

const HodSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  availableTimes: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
  appointments: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],
});

export default mongoose.models.Hod || mongoose.model("Hod", HodSchema);
