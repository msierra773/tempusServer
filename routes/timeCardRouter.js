const express = require("express");
const timeCardRouter = express.Router();
const employee = require("../models/employee.js");


timeCardRouter.get("/", async (req, res, next) => {
  let collection = await employee.db.collection("employees");
  let result = await collection.find({}).limit(1000).toArray();
  res.send(result).status(200);
});

timeCardRouter.post("/", (req, res, next) => {
    console.log(req.body)
  const newEmp = new employee(req.body);
  newEmp.save();
  res.status(200).send(newEmp);
});

timeCardRouter.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const doc = await employee.findOneAndUpdate(
    { _id: id },
    { timeCard: req.body },
    {
      new: true,
      upsert: true,
    }
  );
  res.send(doc).status(204);
});

timeCardRouter.delete("/:postId", async (req, res, next) => {
  console.log(req.params.postId);
  const doc = await employee.findOneAndDelete(
    { _id: req.params.postId },
    { new: true, upsert: true }
  );
  res.send(doc).stutus(204);
});

module.exports = timeCardRouter;
