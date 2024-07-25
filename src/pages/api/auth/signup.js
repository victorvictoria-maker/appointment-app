import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import Hod from "../../../models/Hod";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      name,
      email,
      phoneNumber,
      password,
      userType,
      matricNumber,
      department,
      faculty,
    } = req.body;

    try {
      const existingUser =
        (await User.findOne({ email })) || (await Hod.findOne({ email }));
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      if (userType === "student") {
        const user = new User({
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          matricNumber,
          department,
          faculty,
        });
        await user.save();
      } else {
        const hod = new Hod({
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          department,
        });
        await hod.save();
      }

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
