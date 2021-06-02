const mongoose = require("mongoose");

const url =
  "mongodb+srv://admin:admin12345@socialecom.fpvz3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(url, connectionParams);
