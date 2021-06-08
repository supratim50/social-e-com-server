const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  images: [
    {
      image: {
        type: Buffer,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
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

// temporary hiding data
postSchema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();

  delete postObject.images;

  return postObject;
};

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
