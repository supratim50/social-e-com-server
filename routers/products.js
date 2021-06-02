const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const Product = require("../models/product");

// global variable
let productImages = [];

// upload product data
route.get("/upload/data", auth, async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Fetch product data
route.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// uploada images
// const upload = multer({
//   //   dest: "images",
//   limits: {
//     fileSize: 2000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please insert an image!"));
//     }

//     cb(undefined, true);
//   },
// });

route.post(
  "/upload/image",
  async (req, res) => {
    // console.log(req.file.buffer);
    console.send("upload file");
    res.send();
    // res.send(productImages);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error });
  }
);

module.exports = route;
