const { newToken, verifyToken } = require("../../utils/auth");
const { User } = require("./user.model");

module.exports = {
  signup: async (req, res) => {
    try {
      // Payload check
      if (!req.body.username || !req.body.password || !req.body.fullName) {
        return res
          .status(422)
          .send({ message: "username, fullName, and password are required!" });
      }
      // Creating user
      const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
      });
      // generate token
      const token = newToken(user);
      // send token to client
      return res.status(201).send({ token });
    } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "The username is in use by other user" });
      } else {
        return res.status(400).end();
      }
    }
  },
  signin: async (req, res) => {
    // payload check
    if (!req.body.username || !req.body.password) {
      return res
        .status(422)
        .send({ message: "Username and password is required!" });
    }

    // username check
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Not auth: Username does not exist" });
    }

    try {
      // password check
      const match = await user.checkPassword(req.body.password);
      if (!match) {
        return res.status(401).send({ message: "Not auth: Invalid password" });
      } else {
        // user exist, generate token
        const token = newToken(user);
        res.status(200).send({ token });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send({ message: e });
    }
  },
  update: async (req, res) => {
    let token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: "Not auth: Token is not exist or on a wrong format" });
    }

    try {
      const payload = await verifyToken(token);
      if (payload) {
        let data = await User.findOne({ _id: payload.id });
        if (req.body.password) {
          data.password = req.body.password;
        }
        data.username = req.body.username ? req.body.username : data.username;
        data.fullName = req.body.fullName ? req.body.fullName : data.fullName;
        await data.save();
        res.status(201).send({
          message: "User updated",
          data: { username: data.username, fullName: data.fullName },
        });
      } else {
        res.status(401).send({ message: "Not auth: Username does not exist" });
      }
    } catch (e) {
      if (e.code === 11000) {
        return res
          .status(409)
          .send({ message: "The username is in use by other user" });
      } else {
        console.error(e);
        return res.status(400).end();
      }
    }
  },
};
