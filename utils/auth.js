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
  newToken,
  verifyToken,
  protect,
  admin,
};
