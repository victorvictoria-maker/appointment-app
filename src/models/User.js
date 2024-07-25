import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  matricNumber: String,
  department: String,
  faculty: String,
  appointments: [
    {
      hod: { type: mongoose.Schema.Types.ObjectId, ref: "Hod" },
      date: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],
});

// Define pre-save hook for appointments
UserSchema.pre("save", async function (next) {
  const appointment = this.appointments[this.appointments.length - 1];

  // Check if the appointment date is valid (not less than 24 hours in advance)
  const minBookingTime = addHours(new Date(), 24); // 24 hours from now
  if (appointment.date < minBookingTime) {
    throw new Error("Appointments must be booked at least 24 hours in advance");
  }

  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
