const UserSchema = require("../modals/userSchema");
const UserRoute = require("express").Router();

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
