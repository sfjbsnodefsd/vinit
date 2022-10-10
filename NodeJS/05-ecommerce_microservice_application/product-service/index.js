const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const Product = require("./Product");
const isAuthenticated = require("../isAuthenticated");
const { json } = require("express");

const app = express();
app.use(express.json());

var channel, connection;

mongoose
  .connect("mongodb://localhost:27017/product-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("[PRODUCT-SERVICE] - Connected to database"))
  .catch((err) => {
    console.error(err);
    console.error("[PRODUCT-SERVICE] - DB connection failed!");
  });

async function connect() {
  // const amqpServer = "amqp://localhost:15672";
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}

connect();

// get all products
app.get("/products", isAuthenticated, (req, res) => {
  Product.find()
    .then((docs) => res.status(200).json({ success: 1, products: docs }))
    .catch((err) =>
      res
        .status(500)
        .json({ success: 0, message: "Some error occured", err: err })
    );
});

// create a new product
app.post("/product/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });

  newProduct
    .save()
    .then((r) =>
      res.status(200).json({ success: 1, createdProduct: newProduct })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ success: 0, message: "Some error occured", err: err })
    );
});

// buy a new product
// user will send a list of products the user wants to buy, they will be identified product id
// the order will be created of those products and the sum of the product prices will be the total billing amount
var newOrder;
app.post("/product/buy", isAuthenticated, async (req, res) => {
  const { ids } = req.body;
  const products = await Product.find({ _id: { $in: ids } });
  // res.json(products);

  channel.sendToQueue(
    "ORDER",
    Buffer.from(
      JSON.stringify({
        products,
        userEmail: req.user.email,
      })
    )
  );

  channel.consume("PRODUCT", (data) => {
    newOrder = JSON.parse(data.content);
    channel.ack(data);
  });
  return res.status(200).json({
    success: 1,
    newOrder,
  });
});

app.listen(PORT, () => {
  console.log(`[PRODUCT-SERVICE] - LIVE AT PORT ${PORT}`);
});
