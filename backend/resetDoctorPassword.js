import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";

dotenv.config();

const resetDoctorPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("========================================");
    console.log("✅ MongoDB Connected");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("========================================");

    const doctors = await doctorModel.find({}).select(
      "name email password"
    );

    console.log(`\n👨‍⚕️ Total Doctors: ${doctors.length}\n`);

    if (doctors.length === 0) {
      console.log("❌ No doctors found");
      process.exit(0);
    }

    // New password for ALL doctors
    const newPassword = "doctor123";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );

    let count = 0;

    for (const doctor of doctors) {
      await doctorModel.findByIdAndUpdate(
        doctor._id,
        {
          password: hashedPassword,
        }
      );

      count++;

      console.log(
        `${count}. ${doctor.name}`
      );

      console.log(
        `   📧 Email: ${doctor.email}`
      );

      console.log(
        `   🔑 Password: ${newPassword}`
      );

      console.log("----------------------------------------");
    }

    console.log("\n========================================");
    console.log("✅ ALL DOCTOR PASSWORDS RESET");
    console.log("========================================");

    console.log("\n🔐 COMMON PASSWORD:");
    console.log("doctor123");

    console.log("\n📋 FINAL LOGIN LIST:");

    doctors.forEach((doctor, index) => {
      console.log(
        `${index + 1}. ${doctor.name} → ${doctor.email} → doctor123`
      );
    });

    console.log("\n========================================");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

resetDoctorPasswords();