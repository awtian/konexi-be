const { Post } = require("./post.model");

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
      const id = req.params.id;
      const post = await Post.findById(id);
      const populatedPost = await post.populate("author", [
        "fullName",
        "username",
      ]);
      res.status(201).send(populatedPost);
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
};