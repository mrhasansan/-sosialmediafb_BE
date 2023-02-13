const { check, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      // validasi process
      console, log(req.path);
      await check("username").notEmpty().isAlphanumeric().run(req);
      await check("email").notEmpty().isEmail().run(req);
      await check("password")
        .notEmpty()
        .isStrongPassword({
          minLength: 8,
          minSymbols: 1,
          minNumbers: 1,
          minLowercase: 1,
          minUppercase: 1,
        })
        .run(req);
      await check("phone").notEmpty().run(req);
      await check("bithday").notEmpty().run(req);

      const validation = validationResult(req);
      console.log("check validation", validation);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          success: false,
          message: "Validation invalid ❌",
          error: validation.error,
        });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
