import User from "../models/User.js";

export const cleanupUnverifiedUsers = async () => {
  try {
    // Delete users who are NOT verified and expired
    const result = await User.deleteMany({
      isVerified: false,
      verificationTokenExpiresAt: { $lt: Date.now() }
    });

    if (result.deletedCount > 0) {
      console.log(` Cleanup: Deleted ${result.deletedCount} unverified users`);
    }
  } catch (err) {
    console.error("Error during unverified user cleanup:", err);
  }
};
