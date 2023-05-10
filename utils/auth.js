const jwt = require("jsonwebtoken");
const { User } = require("../resources/user/user.model");

const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWTSIGN, {
    expiresIn: "100d",
  });
};

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWTSIGN, (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    });
  });

const signup = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.fullName) {
      return res
        .status(401)
        .send({ message: "username, fullName, and password is required!" });
    }
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
    });
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    // res.send(e);
    return res.status(400).end();
  }
};

const signin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(401)
      .send({ message: "Username and password is required!" });
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res
      .status(400)
      .send({ message: "Not auth: Username does not exist" });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    console.log(match);
    if (!match) {
      return res.status(401).send({ message: "Not auth: Invalid password" });
    } else {
      const token = newToken(user);
      res.status(200).send({ token, fullName: user.fullName, role: user.role });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send({ message: e });
  }
};

const update = async (req, res) => {
  const password = req.body.password;

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
      data.password = password;
      data.username = req.body.username ? req.body.username : data.username;
      data.fullName = req.body.fullName ? req.body.fullName : data.fullName;
      await data.save();
      res.status(201).send({
        message: "User updated",
        data: { username: data.username, fullName: data.fullName },
      });
    } else {
      res.status(400).send({ message: "Not auth: Username does not exist" });
    }
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res
        .status(400)
        .send({ message: "Your new username has been used by other user" });
    }
    return res.status(400).send({ message: e });
  }
};

const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Not auth: Token does not exist" });
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Not auth: Token is on a wrong format" });
  }

  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ message: "Not auth: Invalid token" });
    }
  } catch (e) {
    res.status(500).send(e);
    console.error(e);
  }
};

const admin = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Not auth: Token does not exist" });
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Not auth: Token is on a wrong format" });
  }

  try {
    const payload = await verifyToken(token);
    const user = await user
      .findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    if (user && user.role < 5) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ message: "Not auth: Invalid token" });
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  signup,
  signin,
  protect,
  update,
  admin,
};
