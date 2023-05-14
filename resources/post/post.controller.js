const { Post } = require("./post.model");
const { Comment } = require("./comment.model");
const { Like } = require("./like.model");
const { User } = require("../user/user.model");

module.exports = {
  create: async (req, res) => {
    try {
      const postPayload = {
        content: req.body.content,
        author: req.user.id,
        image: req.file ? req.file.linkUrl : "",
      };

      let newPost = await Post.create(postPayload);

      newPost = await newPost.populate("author", ["fullName", "username"]);

      res.status(201).send(newPost);
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  findById: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId, "-createdAt");
      if (!post) {
        res.status(404).send({ message: "Post does not exist" });
      } else {
        let populatedPost = await post.populate("author", [
          "fullName",
          "username",
        ]);

        populatedPost = await populatedPost.populate({
          path: "comments",
          select: "author comment -post",
          populate: {
            path: "author",
            select: "username fullName",
          },
        });

        populatedPost = await populatedPost.populate({
          path: "likes",
        });

        res.status(200).send(populatedPost);
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const updatePayload = {
        content: req.body.content,
      };
      if (req.file) {
        updatePayload.image = req.file.linkUrl;
      }
      const filter = { author: req.user.id, _id: req.params.id };

      const update = await Post.findOneAndUpdate(filter, updatePayload, {
        new: true,
        populate: "author",
      });

      update.author = {
        fullName: update.author.fullName,
        username: update.author.username,
      };

      res.status(200).send(update);
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  delete: async (req, res) => {
    try {
      const filter = { author: req.user.id, _id: req.params.id };
      const deleted = await Post.findOneAndDelete(filter, {
        populate: "author",
      });

      if (deleted) {
        deleted.author = {
          fullName: deleted.author.fullName,
          username: deleted.author.username,
        };

        res.status(200).send({ message: "succesfully deleted", post: deleted });
      } else {
        res.status(400).send({
          message:
            "Cannot delete, you might be not authorized or the data does not exist",
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  comment: async (req, res) => {
    try {
      const payload = {
        comment: req.body.comment,
        author: req.user.id,
        post: req.params.id,
      };

      const newComment = await Comment.create(payload);

      let populatedComment = await newComment.populate(
        "author",
        "username fullName"
      );
      populatedComment = await newComment.populate({
        path: "post",
        select: "content author",
        populate: {
          path: "author",
          select: "username fullName",
        },
      });

      res.status(201).send(populatedComment);
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  like: async (req, res) => {
    try {
      const payload = {
        liker: req.user.id,
        post: req.params.id,
      };

      await Like.create(payload);

      res.status(201).send({ message: "succesfully liked the post" });
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).send({ message: "You already liked this post" });
      } else {
        console.error(e);
        return res.status(400).send({ message: e.message });
      }
    }
  },
  unlike: async (req, res) => {
    try {
      const payload = {
        liker: req.user.id,
        post: req.params.id,
      };

      const deleted = await Like.findOneAndDelete(payload);
      if (deleted) {
        res.status(200).send({ message: "succesfully unliked the post" });
      } else {
        res.status(404).send({ message: "you haven't liked this post yet" });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
  getFeed: async (req, res) => {
    try {
      let user = await User.findById(req.user.id);
      let followingArray = [];
      if (user) {
        user = await user.populate("followings", "followed");

        followingArray = user.followings.map((each) => each.followed);
      }
      // adding own post
      followingArray.push(req.user.id);

      const feed = await Post.find({ author: followingArray })
        .sort({
          createdAt: "desc",
        })
        .populate("author", "fullName username");

      res.status(200).send({ data: feed });
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const search = new RegExp(req.query.search, "gi");

      // getting user by username and full name with the id equal to
      const searchByUser = await User.find({
        $or: [
          { username: { $regex: search } },
          { fullName: { $regex: search } },
        ],
      }).select("_id");

      const posts = await Post.find(
        {
          $or: [{ content: { $regex: search } }, { author: searchByUser }],
        },
        {},
        {
          populate: {
            path: "author",
            select: "fullName username",
          },
        }
      );
      res.status(200).send({ data: posts });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ message: e.message });
    }
  },
};
