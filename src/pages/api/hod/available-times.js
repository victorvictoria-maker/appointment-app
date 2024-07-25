// src/pages/api/hod/available-time.js

import dbConnect from "../../../utils/dbConnect";
import Hod from "../../../models/Hod";

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const hods = await Hod.find({});
        // Extract available times from each HOD
        const availableTimes = hods.flatMap((hod) => hod.availableTimes);
        res.status(200).json({ success: true, data: availableTimes });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const hod = await Hod.create(req.body);
        console.log("Created HOD:", hod);
        res.status(201).json({ success: true, data: hod });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const { id, availableTimes } = req.body;
        console.log("Received data for update:", { id, availableTimes });
        if (!id || !availableTimes) {
          return res
            .status(400)
            .json({ success: false, message: "Missing id or available times" });
        }
        const hod = await Hod.findByIdAndUpdate(
          id,
          { availableTimes },
          { new: true, runValidators: true }
        );
        if (!hod) {
          return res
            .status(404)
            .json({ success: false, message: "HOD not found" });
        }
        res.status(200).json({ success: true, data: hod });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
};

export default handler;
