// // resetDoctorPasswords.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import dotenv from 'dotenv';
// import doctorModel from '../models/doctorModel.js';

// dotenv.config();

// export const updateAllDoctorsPassword = async (req, res) => {
//   try {
//     const { password } = req.body;

//     if (!password) {
//       return res.status(400).json({ message: "Password is required." });
//     }

//     // Hash the common password once
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update all doctors' passwords
//     const result = await doctorModel.updateMany({}, { password: hashedPassword });

//     return res.status(200).json({
//       message: 'Password updated successfully for all doctors.',
//       updatedCount: result.modifiedCount
//     });
//   } catch (error) {
//     console.error("Update All Doctors Error:", error.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
