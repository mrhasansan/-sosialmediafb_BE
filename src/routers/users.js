const express = require("express");
const route = express.Router();
const { usersControlers } = require("../controlers");
const { readToken } = require("../config/encript");

route.get("/", usersControlers.getData);
route.post("/register", usersControlers.regis);
route.post("/login", usersControlers.login);
route.get("/keep", readToken, usersControlers.keepLogin);
route.patch("/verified", readToken, usersControlers.verifiedAccount);

module.exports = route;
