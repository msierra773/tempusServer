const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(morgan("dev"));
mongoose.connect("mongodb+srv://msierra773:123@cluster0.jslp3iw.mongodb.net/");
app.use("/timeCard", jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }));
app.use("/timeCard", require("./routes/timeCardRouter.js"));
app.use("/auth", require("./routes/authRouter.js"));


app.use((err, req, res, next) => {
  console.log(err);
  return res.send({ errMsg: err.message });
});

const port = process.env.PORT || 4600;` `
server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

// app.listen(4600, () => {
//   console.log("the server is running on port 4600");
// });
