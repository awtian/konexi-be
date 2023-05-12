const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

postSchema.virtual("comments", {
  ref: "Comment", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "post", // is equal to foreignField
});

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
