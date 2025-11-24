import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["google", "linkedin", "twitter", "instagram", "facebook"],
      required: true,
    },
    providerId: { type: String, required: true }, // e.g. Google user ID
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
        
      minlength: 6,
      // Required if role is "admin", optional if "user"
    },
    
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    resendCount: {
  type: Number,
  default: 0,
},
lastResendAt: {
  type: Date,
},

   
    createdAt: {
      type: Date,
      default: Date.now(),
    },

        resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    onboardingCompleted: {
  type: Boolean,
  default: false,
}
,
    avatar: { type: String },
    providers: {
      type: [providerSchema],
      validate: {
        validator: function (providers) {
          // Admins must not have providers
          if (this.role === "admin" && providers.length > 0) {
            return false;
          }
          return true;
        },
        message: "Admins cannot have social login providers",
      },
    },
    tokenVersion: { type: Number, default: 0 }, // For refresh token invalidation
  },
  
  { timestamps: true }
);

// Ensure unique provider IDs per provider
userSchema.index(
  { "providers.name": 1, "providers.providerId": 1 },
  { unique: true, sparse: true }
);

// Ensure admin must have a password
userSchema.pre("save", function (next) {
  if (this.role === "admin" && !this.password) {
    return next(new Error("Admin must have a password"));
  }
  next();
});

export default mongoose.model("User", userSchema);
