const express = require("express");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const validateEmployee = require("../middleware/validateEmployee");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// All employee routes require auth
router.use(authMiddleware);

// CREATE
router.post("/employees",
  upload.single("profileImage"),
  validateEmployee, 
  async (req, res) => {
    try {
      const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : "";
      const employee = await Employee.create({
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        position: req.body.position,
        salary: req.body.salary,
        profileImageUrl,
      });
      res.status(201).json(employee);
    } catch (err) {
      const msg = String(err.message || "");
      if (msg.toLowerCase().includes("invalid email") || msg.toLowerCase().includes("salary")) {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// LIST
router.get("/employees", async (_req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

// SEARCH
router.get("/employees/search", async (req, res) => {
  const { department, position } = req.query;
  const f = {};
  if (department) f.department = new RegExp(String(department), "i");
  if (position)   f.position   = new RegExp(String(position), "i");
  const employees = await Employee.find(f).sort({ createdAt: -1 });
  res.json(employees);
});

// READ
router.get("/employees/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  res.json(emp);
});

// UPDATE
router.put("/employees/:id",
  upload.single("profileImage"),
  validateEmployee, 
  async (req, res) => {
    try {
      const update = {
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        position: req.body.position,
        salary: req.body.salary,
      };
      if (req.file) update.profileImageUrl = `/uploads/${req.file.filename}`;

      const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true, runValidators: true, context: "query" } 
      );
      if (!updated) return res.status(404).json({ message: "Employee not found" });
      res.json(updated);
    } catch (err) {
      const msg = String(err.message || "");
      if (msg.toLowerCase().includes("invalid email") || msg.toLowerCase().includes("salary")) {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE
router.delete("/employees/:id", async (req, res) => {
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Employee not found" });
  res.json({ message: "Employee deleted" });
});

module.exports = router;
