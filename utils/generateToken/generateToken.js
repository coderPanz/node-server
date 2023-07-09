const jwt = require("jsonwebtoken");
const { jwtSecretKey, options } = require("./config/config");

function generateToken(user) {
  const tokenStr = jwt.sign(user, jwtSecretKey, options);
  return tokenStr;
}

module.exports = generateToken;
