const express = require("express");
const route = express.Router();
const { uploader } = require("../config/uploader");
const { readToken } = require("../config/encript");
const { contentControlers } = require("../controlers");

route.get("/", contentControlers.getData);
route.post("/status", contentControlers.upContent);
// route.put("/comment", contentControlers.commentupdate);
module.exports = route;
