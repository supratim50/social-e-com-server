const route = require("express").Router();
const multer = require("multer");

const auth = require("../middleware/auth");
const Post = require("../models/post");

let postImages = [];

// UPLOAD DATA
route.post("/upload", auth, async (req, res) => {
  const postData = req.body;
  postData.userID = req.user._id.toString();

  const post = Post(postData);

  try {
    await post.save();
    // uploading images
    postImages.map((buffer) => {
      post.images = post.images.concat({ image: buffer });
    });
    await post.save();
    res.send();
    postImages = [];
  } catch (err) {
    res.status(400).send({ error: err.messages });
  }
});

// UPLOAD IMAGES
const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
      return cb(new Error("Please enter an image"));
    }

    cb(undefined, true);
  },
});
// route
route.post(
  "/upload/images",
  upload.single("upload"),
  (req, res) => {
    const imageBuffer = req.file.buffer;
    postImages.push(imageBuffer);
    res.send(postImages);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = route;
