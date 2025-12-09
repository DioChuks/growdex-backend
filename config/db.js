import mongoose from "mongoose";
import { appConfig } from "../config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(appConfig.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
