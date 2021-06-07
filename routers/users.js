const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { removeListener } = require("../models/users");
const route = express.Router();

const User = require("../models/users");

// fetch all users
route.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

// register
route.post("/user", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Upload profile picture
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please insert an image!"));
    }

    cb(undefined, true);
  },
});
route.post(
  "/upload/me/avatar",
  auth,
  upload.single("upload"),
  async (req, res) => {
    req.user.userImage = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete profile picture
route.delete("/upload/me/avatar", auth, async (req, res) => {
  try {
    req.user.userImage = undefined;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// fetch profile image
route.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);

    if (!user || !user.userImage) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.userImage);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// login
route.post("/user/login", async (req, res) => {
  try {
    // check password
    const user = await User.findByCredential(req.body.email, req.body.password);
    // create token
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// LOGOUT
route.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user.tokens);
  } catch (err) {
    res.send();
  }
});
// LOGOUT ALL
route.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// STORING INTEREST
route.post("/user/interest", auth, async (req, res) => {
  const { interest } = req.body;

  try {
    req.user.interest = interest;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = route;
