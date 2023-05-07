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
  const { email, password } = req.body;
  try {
    let data = await UserSchema.findOne({ email: email });
    if (data.password === password) {
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
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//Auth
UserRoute.post("/user/auth", async (req, res) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    JWT.verify(token, secret, (err, data) => {
      if (err) res.status(404).json({ isUser: false });
      res.status(200).json({ ...data, isUser: true });
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
