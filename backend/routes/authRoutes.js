const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isValidEmail } = require("../utils/validators");

const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = String(email).trim().toLowerCase();
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: String(name).trim(), email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "User created", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    const msg = String(err.message || "");
    if (msg.toLowerCase().includes("invalid email"))
      return res.status(400).json({ message: "Invalid email format" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    email = String(email).trim().toLowerCase();
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await require("bcryptjs").compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
