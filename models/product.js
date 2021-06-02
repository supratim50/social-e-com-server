const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  price: {
    type: Number,
    require: true,
    trim: true,
  },
  category: {
    type: String,
    require: true,
    trim: true,
  },
  images: [
    {
      image: {
        type: Buffer,
      },
    },
  ],
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
