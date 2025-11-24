import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, default: "admin" },
    profilePic: { type: String }, // Cloudinary URL
    profilePicPublicId: { type: String }, // for deleting old pic
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
