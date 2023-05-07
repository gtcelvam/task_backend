const Jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    var token = authHeader.split(" ")[1];
    Jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(403).json("Token Invalid");
      }
      req.data = data;
      next();
    });
  } else {
    res.status(401).json("Not Authenticated!");
  }
};

const encryptText = (password) => {
  try {
    return CryptoJS.AES.encrypt(password, process.env.TS_KEY).toString();
  } catch (error) {
    console.log("Error : ", error);
  }
};

const decryptText = (password) => {
  try {
    return CryptoJS.AES.decrypt(password, process.env.TS_KEY).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    console.log("Error : ", error);
  }
};

module.exports = { verifyToken, encryptText, decryptText };
