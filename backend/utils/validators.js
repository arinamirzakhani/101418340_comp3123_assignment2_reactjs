
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const s = email.trim();
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(s);
}

module.exports = { isValidEmail };

