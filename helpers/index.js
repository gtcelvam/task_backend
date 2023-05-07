const Jwt = require("jsonwebtoken");

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

module.exports = { verifyToken };
