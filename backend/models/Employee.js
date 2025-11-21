const mongoose = require("mongoose");
const { isValidEmail } = require("../utils/validators");

const employeeSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    email:  {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: { validator: isValidEmail, message: "Invalid email format" },
    },
    department: { type: String, required: true, trim: true },
    position:   { type: String, required: true, trim: true },
    salary:     { type: Number, required: true, min: 0, set: v => Number(v) },
    profileImageUrl: { type: String },
  },
  { timestamps: true }
);


employeeSchema.pre("findOneAndUpdate", function (next) {
  const u = this.getUpdate() || {};
  if (u.email && !isValidEmail(String(u.email))) {
    return next(new Error("Invalid email format"));
  }
  if (Object.prototype.hasOwnProperty.call(u, "salary")) {
    const n = Number(u.salary);
    if (!Number.isFinite(n) || n <= 0) return next(new Error("Salary must be a positive number"));
    u.salary = n;
    this.setUpdate(u);
  }
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);

