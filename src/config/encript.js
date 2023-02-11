const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hasPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
  },
  createToken: (payload, expired = "24h") => {
    console.log("payload adalah", payload);
    let token = jwt.sign(payload, "socialmediafb", {
      expiresIn: expired,
    });
    return token;
  },
  readToken: (req, res, next) => {
    jwt.verify(req.token, "socialmediafb", (err, decript) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Aunthenticate token failed",
        });
      }
      console.log("decript", decript);
      req.decript = decript;
      next();
    });
  },
};
