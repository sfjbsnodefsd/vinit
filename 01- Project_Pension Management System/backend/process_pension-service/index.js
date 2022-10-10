const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5001;
const amqp = require("amqplib");
const isAuthenticated = require("../isAuthenticated");

const app = express();
app.use(express.json());

var connection, channel;

async function connect() {
  // const amqpServer = "amqp://localhost:15672";
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PROCESS_PENSION");
}

connect();

app.post("/processpension", isAuthenticated, (req, res) => {
  const { aadhaar } = req.body;

  channel.sendToQueue(
    "PENSIONER_DETAIL",
    Buffer.from(
      JSON.stringify({
        aadhaar,
        userEmail: req.user.email,
      })
    )
  );

  channel.consume("PROCESS_PENSION", (data) => {
    channel.ack(data);
    let response_from_pensioner_detail = JSON.parse(data.content);
    if(response_from_pensioner_detail.success) {
        res.status(200).json({
            pensioner: response_from_pensioner_detail.pensioner
        });
    } else {
        res.status(400).json({
            err: response_from_pensioner_detail.err
        });
    }
  });
});

app.listen(PORT, () => {
  console.log(`[PENSIONER_DETAIL-SERVICE] - LIVE AT PORT ${PORT}`);
});
