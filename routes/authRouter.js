const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const tempusAdmin = require("../models/tempusAdmin.js");

const handleErrors = (err) => {
    console.log(err.message, err.code);
  
    let errors = {
      username: "",
      password: "",
    };
    if (err.message === "incorrect username") {
      errors.username = "that username is not registered";
    }
    if (err.message === "incorrect password") {
      errors.password = "that password is incorrect";
    }
    if (err.code === 11000) {
      errors.username = "that username is already registered";
      return errors;
    }
    if (err.message.includes("user validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };

  authRouter.post("/signup", async (req, res, next) => {
    console.log(req.body);
    const { username, password, fullName, role } = req.body;
    try {
      const admin = await tempusAdmin.create({
        username,
        password,
        fullName,
        
      });
      const token = jwt.sign({ username: admin.username, password: admin.password }, process.env.SECRET);
      res.status(201).json({ token, admin });
    } catch (err) {
      console.log(err);
      const errors = handleErrors(err);
      res.status(400).json(errors);
    }
  });

  authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const tempusAdmin = await tempusAdmin.login(username, password);
      const token = jwt.sign({ username: admin.username, password: admin.password }, process.env.SECRET);
      res.status(200).json({ token, admin: admin});
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  });

  module.exports = authRouter;