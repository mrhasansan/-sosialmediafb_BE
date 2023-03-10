const { dbConf } = require("../config/db");

module.exports = {
  getData: (req, res) => {
    dbConf.query(" SELECT * FROM content ", (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
  upContent: (req, res) => {
    const { username, description, numlike, comment } = req.body;
    dbConf.query(` INSERT INTO content (username, description, numlike, comment ) VALUES (${dbConf.escape(username)}, ${dbConf.escape(description)}, ${dbConf.escape(numlike)}, ${dbConf.escape(comment)});`, (errInsert, resultInsert) => {
      if (errInsert) {
        console.log(errInsert);
        return res.status(500).send(errInsert);
      }
      res.status(200).send({
        succest: true,
        message: "Adding content success",
      });
    });
  },
  contentImg: (req, res) => {
    console.log(req.files);
    console.log("cek decrop img", req.decript);
    // penyimpanan ke database ; /imgContent/filename
    dbConf.query(`UPDATE content SET imagecontent=${dbConf.escape(`/imgContent/${req.files[0].filename}`)} WHERE id=${dbConf.escape(req.decript.id)}`, (err, results) => {
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
  totallike: (req, res) => {
    const userLiking = req.body.userLiking;
    const postId = req.body.postId;

    dbConf.query(`INSERT INTO content (userLiki , postId) VALUES (?,?)`, [userLiking, postId], (err, results) => {
      if (err) {
        console.log(err);
      }
      dbConf.query(`UPDATE content SET numlike =numlike +1 WHERE id =?`),
        postId,
        (err2, result2) => {
          res.send(results);
        };
    });
  },
};
