const express = require("express");
const PORT = process.env.PORT || 5001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const Product = require("./Product");
const isAuthenticated = require("../isAuthenticated");

const app = express();
app.use(express.json());

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
app.get("/products", (req, res) => 
Product.find()
.then(docs => res.status(200).json({success: 1, products: docs}))
.catch(err => 
  res
  .status(500)
  .json({ success: 0, message: "Some error occured", err: err }))
);

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

app.listen(PORT, () => {
  console.log(`[PRODUCT-SERVICE] - LIVE AT PORT ${PORT}`);
});
