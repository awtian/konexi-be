const { verifyToken } = require("../../utils/auth");
const { Post } = require("./post.model");

module.exports = {
  create: async (req, res) => {
    let token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: "Not auth: Token is invalid or on a wrong format" });
    }

    try {
      const user = await verifyToken(token);
      if (user) {
        console.log(req.body);
        const postPayload = {
          content: req.body.content,
          author: user.id,
          image: req.file ? req.file.linkUrl : "",
        };

        console.log("POST PAYLOAD", postPayload);

        let newPost = await Post.create(postPayload);
        newPost = await newPost.populate("author", ["fullName", "username"]);
        res.status(201).send(newPost);
      } else {
        res
          .status(401)
          .send({ message: "Not auth: Token is invalid or on a wrong format" });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e.message });
    }
  },
};
