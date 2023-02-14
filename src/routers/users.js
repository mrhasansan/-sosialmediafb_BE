const express = require("express");
const route = express.Router();
const { usersControlers } = require("../controlers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");
const { checkUser } = require("../config/validator");

route.get("/", usersControlers.getData);
route.post("/register", usersControlers.regis);
route.post("/login", usersControlers.login);
route.get("/keep", readToken, usersControlers.keepLogin);
route.patch("/verified", readToken, usersControlers.verifiedAccount);
route.patch("/profile", readToken, uploader("/imgProfile", "IMGPROFILE").array("images", 1), usersControlers.profilImg);
route.patch("/fullname,", readToken, usersControlers.editfullname);
// route.patch("/fullname", readToken, usersControlers.updatefullname);
// route.patch("/bio", readToken, usersControlers.updateBio);

module.exports = route;
