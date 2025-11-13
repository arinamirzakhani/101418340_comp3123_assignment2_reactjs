// Strong, practical email check (no libs)
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const s = email.trim();
  // no spaces, one @, at least one dot with >=2 chars after it
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(s);
}

module.exports = { isValidEmail };

