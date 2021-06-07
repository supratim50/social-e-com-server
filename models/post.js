const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userID: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    trim: true,
  },
  images: [
    {
      image: {
        type: Buffer,
        require: true,
      },
    },
  ],
  like: {
    totalLike: {
      type: Number,
    },
    users: [
      {
        userId: {
          type: String,
        },
      },
    ],
  },
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
