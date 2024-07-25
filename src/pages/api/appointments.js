// src/pages/api/appointments.js

// Import necessary modules
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import Hod from "../../models/Hod";

// Define the handler function
const handler = async (req, res) => {
  const { method } = req;

  // Connect to database
  await dbConnect();

  // Handle different HTTP methods
  switch (method) {
    case "GET":
      try {
        // Fetch all users and populate appointments with HOD details
        const appointments = await User.find({}).populate("appointments.hod");
        res.status(200).json({ success: true, data: appointments });
      } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { studentId, time, hodId } = req.body;

        // Validate the request body
        if (!studentId || !time || !hodId) {
          return res.status(400).json({
            success: false,
            error: "Student ID, Time, and HOD ID are required",
          });
        }

        // Find the user by ID
        const user = await User.findById(studentId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        // Find the HOD by ID
        const hod = await Hod.findById(hodId);
        if (!hod) {
          return res
            .status(404)
            .json({ success: false, error: "HOD not found" });
        }

        // Create a new appointment object
        const newAppointment = {
          hod: hodId,
          date: new Date(time),
          status: "pending",
        };

        // Update user's appointments array and save
        user.appointments.push(newAppointment);
        await user.save();

        // Update HOD's appointments array and save
        hod.appointments.push({
          student: studentId,
          date: new Date(time),
          status: "pending",
        });
        await hod.save();

        // Respond with success and the newly created appointment
        res.status(201).json({ success: true, data: newAppointment });
      } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error adding appointment:", error);
        res.status(500).json({ success: false, error: "Server error" });
      }
      break;
    default:
      // Handle cases where the HTTP method is not allowed (e.g., PUT, DELETE)
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
};

// Export the handler function
export default handler;
