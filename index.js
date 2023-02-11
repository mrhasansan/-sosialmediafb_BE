const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT || 2000;
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bearerToken());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1> SOCIAL MEDIA API </h1>");
});

// check connection database
const { dbConf } = require("./src/config/db");
dbConf.getConnection((err, connection) => {
  if (err) {
    console.log(`Error mysql connections`, err.sqlMessage);
  }
  console.log(`Connections mysql success : ${connection.threadId} `);
});

// configure Route
const { usersRouter } = require("./src/routers");
app.use("/users", usersRouter);
app.listen(PORT, () => console.log("API RUNNING ON PORT ", PORT));
