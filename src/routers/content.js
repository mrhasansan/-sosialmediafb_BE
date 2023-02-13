const express = require("express");
const route = express.Router();
const { contentControlers } = require("../controlers");

route.get("/", contentControlers.getData);
route.post("/status", contentControlers.upContent);

module.exports = route;
