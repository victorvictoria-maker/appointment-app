import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import Hod from "../../../../models/Hod";
import {
  checkAvailability,
  bookAppointment,
} from "../../../../utils/googleCalendar";

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id).populate("appointments.hod");
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: user.appointments });
      } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, error: "Server error" });
      }
      break;

    case "POST":
      try {
        const { studentId, time, hodId } = req.body;

        if (!studentId || !time || !hodId) {
          return res.status(400).json({
            success: false,
            error: "Student ID, Time, and HOD ID are required",
          });
        }

        const user = await User.findById(studentId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        const hod = await Hod.findById(hodId);
        if (!hod) {
          return res
            .status(404)
            .json({ success: false, error: "HOD not found" });
        }

        // Replace with actual implementation of checkAvailability and bookAppointment
        const isAvailable = await checkAvailability(
          hod.email,
          hod.accessToken,
          hod.refreshToken,
          time
        );
        if (!isAvailable) {
          return res
            .status(400)
            .json({ success: false, error: "Appointment slot not available" });
        }

        const appointmentDetails = await bookAppointment(
          hod.email,
          user.email,
          hod.accessToken,
          hod.refreshToken,
          time
        );
        if (!appointmentDetails) {
          return res.status(500).json({
            success: false,
            error: "Failed to book appointment, please try again later",
          });
        }

        const newAppointment = {
          hod: hodId,
          date: new Date(time),
          status: "pending",
          googleEventId: appointmentDetails.id,
        };

        user.appointments.push(newAppointment);
        await user.save();

        hod.appointments.push({
          student: studentId,
          date: new Date(time),
          status: "pending",
          googleEventId: appointmentDetails.id,
        });
        await hod.save();

        res.status(201).json({ success: true, data: newAppointment });
      } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ success: false, error: "Server error" });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
};

export default handler;
