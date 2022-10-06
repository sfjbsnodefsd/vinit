const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./Order");
const PORT = process.env.PORT || 5002;
const amqp = require("amqplib");
const isAuthenticated = require("../isAuthenticated");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/order-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("[ORDER-SERVICE] - Connected to database"))
  .catch((err) => {
    console.error(err);
    console.error("[ORDER-SERVICE] - DB connection failed!");
  });

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

connect();

app.listen(PORT, () => {
  console.log(`[ORDER-SERVICE] - LIVE AT PORT ${PORT}`);
});
