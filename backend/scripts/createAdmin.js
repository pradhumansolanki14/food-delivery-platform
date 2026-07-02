/**
 * Run once to create the first admin account in the database.
 * Usage: node scripts/createAdmin.js
 *
 * This uses the ADMIN_SECRET_KEY from .env to authorize creation.
 * Change email/password below before running.
 */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import adminModel from "../models/adminModel.js";
import 'dotenv/config';

const ADMIN_NAME = "Super Admin";
const ADMIN_EMAIL = "admin@tomato.com";
const ADMIN_PASSWORD = "Admin@1234"; // Change this!

async function createAdmin() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    const exists = await adminModel.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      console.log("⚠️  Admin already exists:", ADMIN_EMAIL);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = new adminModel({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
    });

    await admin.save();
    console.log("🎉 Admin created successfully!");
    console.log("   Email   :", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   ⚠️  Change the password after first login!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
