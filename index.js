const express = require("express");
const dotenv = require("dotenv");
require("./db/mongoose");
const userRoutes = require("./routers/users");

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
