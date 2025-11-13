const mongoose = require("mongoose");
const { isValidEmail } = require("../utils/validators");

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: { validator: isValidEmail, message: "Invalid email format" },
    },
    password: { type: String, required: true },
    role:     { type: String, default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("findOneAndUpdate", function (next) {
  const u = this.getUpdate() || {};
  if (u.email && !isValidEmail(String(u.email))) {
    return next(new Error("Invalid email format"));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

