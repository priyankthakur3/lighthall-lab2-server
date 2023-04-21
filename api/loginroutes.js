const express = require("express");
const jwt = require("jsonwebtoken");
const validations = require("./validations");
const userData = require("./usersdata");
const router = express.Router();

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    "shhhhh11111",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.set("Access-Control-Allow-Origin", "*").json({
          message: "Login Successfully.",
          token: token,
          username: data.username,
          status: true,
        });
      }
    }
  );
}
router.post("/login", async (req, res) => {
  let username, password;
  try {
    username = validations.isStringName(req.body.username, "User Name");
    password = validations.checkString(req.body.password);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  if (!(await userData.checkIfUserExists(username)))
    return res
      .status(400)
      .json({ error: "Either Username or password is incorrect" });
  let dbUser;
  try {
    dbUser = await userData.checkUser(username, password);
    checkUserAndGenerateToken(dbUser, req, res);
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
});

router.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    username = validations.isStringName(username, "Username");
    password = validations.checkString(password, "Password");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  if (await userData.checkIfUserExists(username))
    return res.status(400).json({ error: "User already exists in system" });
  let userCreated;
  try {
    userCreated = await userData.createUser(username, password);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  if (userCreated) {
    return res.json({ status: "User Created" });
  }
});

router.post("/logout", async (req, res) => {
  const { token } = req.body;
  console.log(token);
});

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: "Apis",
  });
});

module.exports = router;
