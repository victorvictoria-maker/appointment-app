import dbConnect from "../../../utils/dbConnect";
import Hod from "../../../models/Hod";

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const hod = await Hod.findById(req.query.id);
        if (!hod) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: hod });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const hod = await Hod.findByIdAndUpdate(req.query.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!hod) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: hod });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
