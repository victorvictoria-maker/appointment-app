// src/scripts/ScheduleReminders.js

import { sendEmail } from "../utils/email";
import { sendSMS } from "../utils/sms";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";
import User from "../models/User";
import Hod from "../models/Hod";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const scheduleReminders = async () => {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const appointments = await Appointment.find({
    date: {
      $gte: reminderTime,
      $lt: new Date(reminderTime.getTime() + 60 * 60 * 1000),
    }, // Within the next hour
  });

  for (const appointment of appointments) {
    const student = await User.findById(appointment.studentId);
    const hod = await Hod.findById(appointment.hodId);

    const emailSubject = "Appointment Reminder";
    const emailText = `Reminder: You have an appointment scheduled at ${appointment.date}.`;
    const smsMessage = `Reminder: You have an appointment scheduled at ${appointment.date}.`;

    // Send email and SMS to the student
    if (student.email) await sendEmail(student.email, emailSubject, emailText);
    if (student.phoneNumber) await sendSMS(student.phoneNumber, smsMessage);

    // Send email and SMS to the hod
    if (hod.email) await sendEmail(hod.email, emailSubject, emailText);
    if (hod.phoneNumber) await sendSMS(hod.phoneNumber, smsMessage);
  }

  console.log("Reminders sent successfully.");
  mongoose.connection.close();
};

scheduleReminders().catch((error) => {
  console.error("Error scheduling reminders:", error);
  mongoose.connection.close();
});
