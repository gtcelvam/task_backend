const { decryptText } = require("../helpers");
const UserSchema = require("../modals/userSchema");
const UserRoute = require("express").Router();
const JWT = require("jsonwebtoken");

//constants
const secret = process.env.JWT_SECRET;

//Add
UserRoute.post("/user", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const userSchema = new UserSchema(data);
  try {
    const data = await userSchema.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//Login
UserRoute.post("/user/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    let data = await UserSchema.findOne({ email: name });
    let decryptUserPass = decryptText(password);
    let decryptDBPass = decryptText(data.password);
    if (decryptUserPass === decryptDBPass) {
      const accessToken = JWT.sign(
        {
          id: data._id,
          email: data.email,
        },
        secret,
        {
          expiresIn: "3d",
        }
      );
      res.status(200).json({ ...data._doc, accessToken });
    } else {
      res.status(200).send({ message: "User Not Authorized" });
    }
  } catch (error) {
    res.status(200).json({ message: "No User Found" });
  }
});

//Auth
UserRoute.post("/user/auth", async (req, res) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    JWT.verify(token, secret, (err, data) => {
      if (err) res.status(404).json({ isUser: false });
      else res.status(200).json({ ...data, isUser: true });
    });
  }
});

//Get
UserRoute.get("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await UserSchema.findOne({ email: id });
    const userInfo = data;
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = UserRoute;
