const { dbConf, dbQuery } = require("../config/db");
const { hasPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");

module.exports = {
  getData: (req, res) => {
    dbConf.query("SELECT * FROM users", (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
  getDatabyId: (req, res) => {
    let { username, email } = req.body;
    dbConf.query(`SELECT username,email,bio,fullname FROM users WHERE id=${dbConf.escape(req.decript.id)}`, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
  regis: async (req, res) => {
    try {
      let { username, email, password, phone, birthday } = req.body;
      const newPass = hasPassword(password);
      console.log(newPass);
      let results = await dbQuery(`SELECT * FROM users WHERE email=${dbConf.escape(email)} OR username=${dbConf.escape(username)}`);
      if (results.length > 0) {
        return res.status(200).send({
          success: false,
          message: "Username or Email is existed",
        });
      } else {
        let resultInsert = await dbQuery(
          ` INSERT INTO users (username,email,password, phone,birthday) VALUES (${dbConf.escape(username)}, ${dbConf.escape(email)}, ${dbConf.escape(newPass)}, ${dbConf.escape(phone)}, ${dbConf.escape(birthday)});`
        );
        console.log("cek insert", resultInsert);
        let token = createToken({ id: resultInsert.insertId, username, email });
        transport.sendMail(
          {
            from: "Facebookclone admin",
            to: email,
            subject: "Verification email account",
            html: `
            <div>
              <h3>Click link below for verification your email</h3>
              <a href="http://localhost:3000/verification?t=${token}">Verifie Now</a>
            </div>`,
          },
          (err, info) => {
            if (err) {
              return res.status(400).send(err);
            }
            return res.status(201).send({
              success: true,
              message: "Register your account success ✅, check your email",
              info,
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
    // let { username, email, password, phone, birthday } = req.body;
    // const newPass = hasPassword(password);
    // console.log(newPass);
    // dbConf.query(
    //   `INSERT INTO users (username,email,password,phone,birthday) VALUES (${dbConf.escape(username)}, ${dbConf.escape(email)}, ${dbConf.escape(newPass)}, ${dbConf.escape(phone)}, ${dbConf.escape(birthday)})`,
    //   (errInsert, resultinsert) => {
    //     if (errInsert) {
    //       console.log(errInsert);
    //       return res.status(500).send(errInsert);
    //     }
    //     res.status(200).send({
    //       succest: true,
    //       message: "Registrasi your account succest",
    //     });
    //   }
    // );
  },
  login: (req, res) => {
    console.log(req.body);
    dbConf.query(`SELECT id, username, password, phone, email FROM users WHERE username=${dbConf.escape(req.body.username)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      console.log("cek users", result[0]);
      const checkPass = bcrypt.compareSync(req.body.password, result[0].password);
      console.log(checkPass);
      delete result[0].password;
      if (checkPass) {
        console.log(result[0]);
        let token = createToken({ ...result[0] });
        return res.status(200).send({ ...result[0], token });
      } else {
        return res.status(401).send({
          success: false,
          message: " Your password is wrong",
        });
      }
    });
  },
  keepLogin: (req, res) => {
    console.log(req.decript);
    dbConf.query(`SELECT id, username,phone, password FROM users WHERE id=${dbConf.escape(req.decript.id)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      let token = createToken({ ...result[0] });
      return res.status(200).send({ ...result[0], token });
    });
  },
  verifiedAccount: (req, res) => {
    console.log("req dex", req.decript);
    dbConf.query(`UPDATE users SET status="verified" WHERE id=${dbConf.escape(req.decript.id)}`, (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
        });
      }
      return res.status(200).send({
        success: true,
        message: "Your account verified ✅",
      });
    });
  },
  profilImg: (req, res) => {
    console.log(req.files);
    console.log("cek decrop img", req.decript);
    // penyimpanan ke database ; /imgProfile/filename
    dbConf.query(`UPDATE users SET profile=${dbConf.escape(`/imgProfile/${req.files[0].filename}`)} WHERE id=${dbConf.escape(req.decript.id)}`, (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
        });
      }
      return res.status(200).send({
        success: true,
        message: "Upload success ✅",
      });
    });
  },
  // updatefullname: (req, res) => {
  //   let { fullname } = req.body;
  //   dbConf.query(` UPDATE users SET fullname=${dbConf.escape(fullname)}WHERE id=${dbConf.escape(req.decript.id)}`, (errinsert, resultInsert) => {
  //     if (errinsert) {
  //       console.log(errinsert);
  //       return res.status(500).send(errinsert);
  //     }
  //     res.status(200).send({
  //       success: true,
  //       message: "Your fullname has bee updated",
  //     });
  //   });
  // },
  // updateBio: (req, res) => {
  //   let { bio } = req.body;
  //   dbConf.query(` UPDATE users SET bio=${dbConf.escape(bio)} WHERE id=${dbConf.escape(req.decript.id)}`, (errinsert, resultInsert) => {
  //     if (errinsert) {
  //       console.log(errinsert);
  //       return res.status(500).send(errinsert);
  //     }
  //     res.status(200).send({
  //       success: true,
  //       message: "Your Bio has bee updated",
  //     });
  //   });
  // },
};
