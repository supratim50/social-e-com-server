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
    //images
    productImages.map((buffer) => {
      product.images = product.images.concat({ image: buffer });
      productImages = [];
    });
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Fetch all products
route.get(
  "/",
  auth,
  async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error });
  }
);

// Fetch product data
route.get("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// upload images
const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please insert an image!"));
    }

    cb(undefined, true);
  },
});

route.post(
  "/upload/image",
  auth,
  upload.single("upload"),
  async (req, res) => {
    productImages.push(req.file.buffer);
    res.send({ file: req.file.buffer });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete images from database
route.delete("/delete/:productId/image/:imageID", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    product.images = product.images.filter((image) => {
      return image._id != req.params.imageID;
    });

    await product.save();
    res.send(product);
  } catch (err) {
    res.send(err);
  }
});

module.exports = route;
