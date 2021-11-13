const route = require("express").Router();
const multer = require("multer");
const path = require("path");

const auth = require("../middleware/auth");
const Post = require("../models/post");

let postImages = [];

// UPLOAD DATA
route.post("/upload", auth, async (req, res) => {
  const postData = req.body;
  postData.userEmail = req.user.email;

  const post = Post(postData);

  try {
    await post.save();
    // images save to database
    postImages.map((image) => {
      post.images = post.images.concat({ image });
      postImages = [];
    });
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// UPLOAD IMAGES
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/posts/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
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
    const imageUrl = `http://localhost:4000/images/posts/${req.file.filename}`;

    postImages.push(imageUrl);
    console.log(req.file);
    res.send(postImages);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// FETCH ALL POSTS
route.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});

    if (!posts) {
      throw new Error("Post is not found!");
    }

    // const { post } = posts;

    res.send(posts);
  } catch (err) {
    res.send({ error: err.message });
  }
});

// FETCH POSTS BY EMAIL
route.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const posts = await Post.find({ userEmail: email });

    if (!posts) {
      throw new Error("Post is not found!");
    }

    // const { post } = posts;

    res.send(posts);
  } catch (err) {
    res.send({ error: err.message });
  }
});

// FETCH POSTS BY CATEGORY
route.get("/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const posts = await Post.find({ category });
    res.send(posts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// LIKING THE POST
route.post("/like/:postId", auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post is no longer abvailable!");
    }

    const users = post.likes.users;
    // pushing the user id in users array
    users.push(req.user);
    // save to database
    await post.save();

    // add total like
    post.likes.totalLike = users.length;
    await post.save();

    res.send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// COMMENT ON THE POST
route.post("/comment/:postId", auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post is no longer available!");
    }

    const comment = {
      userId: req.user._id.toString(),
      text: req.body.comment,
    };

    // saving comment into database
    post.comments = post.comments.concat({ comment });
    await post.save();

    res.send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// FETCHING LIKES
route.get("/likes/:postId", auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post is no longer available!");
    }

    res.send(post.likes);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// FETCHING COMMENTS

module.exports = route;
