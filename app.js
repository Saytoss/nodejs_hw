const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const contactsRouter = require("./contacts/contacts.router");
const userRouter = require("./users/users.router");

const PORT = process.env.PORT || 3000;
const mongodb_URL = process.env.MONGODB_URL;

class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.server = express();
    this.initMiddlewares();
    this.initRouters();
    await this.initDB();
    this.listen();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(morgan("dev"));
  }

  initRouters() {
    this.server.use("/contacts", contactsRouter);
    this.server.use("/users", userRouter);
  }
  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }
  async initDB() {
    try {
      await mongoose.connect(mongodb_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
    }
  }
}

const server = new Server();
server.start();
