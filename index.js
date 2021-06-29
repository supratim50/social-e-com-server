const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

require("./db/mongoose");

const userRoutes = require("./routers/users");
const productRoutes = require("./routers/products");
const postRoutes = require("./routers/post");

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(userRoutes);
app.use(cors());
app.use("/products", productRoutes);
app.use("/post", postRoutes);
// for accessing the image
app.use("/images/posts/", express.static("images/posts"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
