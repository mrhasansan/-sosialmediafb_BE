const mysql = require("mysql2");
const util = require("util");

const dbConf = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: process.env.DB,
});
const dbQuery = util.promisify(dbConf.query).bind(dbConf);
module.exports = {
  dbConf,
  dbQuery,
};
