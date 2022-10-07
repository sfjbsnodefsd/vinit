const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./Order");
const PORT = process.env.PORT || 5002;
const amqp = require("amqplib");

const app = express();
app.use(express.json());

var connection, channel;

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

const createOrder = (products, userEmail) => {
  let total = 0;
  for (let t = 0; t < products.length; ++t) {
    total += products[t].price;
  }
  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
  newOrder.save();
  return newOrder;
};

connect().then(() => {
  channel.consume("ORDER", (data) => {
    const { products, userEmail } = JSON.parse(data.content);
    const newOrder = createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)));
  });
});

app.listen(PORT, () => {
  console.log(`[ORDER-SERVICE] - LIVE AT PORT ${PORT}`);
});
