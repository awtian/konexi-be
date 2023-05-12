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

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({
        message: "Not auth: Token might be invalid or on a wrong format",
      });
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token) {
    return res
      .status(401)
      .send({
        message: "Not auth: Token might be invalid or on a wrong format",
      });
  }

  try {
    const verified = await verifyToken(token);
    req.user = { id: verified.id };
    next();
  } catch (e) {
    console.error(e);
    res
      .status(401)
      .send({
        message: "Not auth: Token might be invalid or on a wrong format",
      });
  }
};

module.exports = {
  newToken,
  verifyToken,
  auth,
};
