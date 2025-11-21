const { isValidEmail } = require("../utils/validators");


function validateEmployee(req, res, next) {
  const { name, email, department, position, salary } = req.body;

  
  if (!name || !email || !department || !position || salary == null) {
    return res.status(400).json({ message: "All fields except picture are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const salaryNum = Number(salary);
  if (!Number.isFinite(salaryNum) || salaryNum <= 0) {
    return res.status(400).json({ message: "Salary must be a positive number" });
  }

  
  req.body.email = normalizedEmail;
  req.body.name = String(name).trim();
  req.body.department = String(department).trim();
  req.body.position = String(position).trim();
  req.body.salary = salaryNum;

  return next();
}

module.exports = validateEmployee;
