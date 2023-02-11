const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "marufhazan@gmail.com",
    pass: "wvobtzpaplavvhne",
  },
});

module.exports = {
  transport,
};
