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
    if (response_from_pensioner_detail.success) {
      const { classification, salary_earned, allowances, bank_detail } =
        response_from_pensioner_detail.pensioner;
      const pensionPercentage = getPensionPercentage(classification);
      if (pensionPercentage === null) {
        console.error("[DEBUG] Provided Pension classifation is not supported");
        return res.status(500).json({
          success: 0,
          err: "Internal server error",
        });
      }

      const PensionAmount = (80 * salary_earned) / 100 + allowances;
      const ServiceCharge = getBankServiceCharge(bank_detail.bank_type);
      if (ServiceCharge === null) {
        console.error("[DEBUG] Provided Bank classifation is not supported");
        return res.status(500).json({
          success: 0,
          err: "Internal server error",
        });
      }

      return res.status(200).json({
        success: 1,
        pensionDetail: {
          PensionAmount,
          ServiceCharge,
        },
      });
    } else {
      return res.status(400).json({
        err: response_from_pensioner_detail.err,
      });
    }
  });
});

const getPensionPercentage = (classification) => {
  let percentage = null;
  switch (classification.toUpperCase()) {
    case "SELF":
      percentage = 80;
      break;

    case "FAMILY":
      percentage = 50;
      break;
  }
  return percentage;
};

const getBankServiceCharge = (bank_type) => {
  let serviceCharge = null;

  switch (bank_type.toUpperCase()) {
    case "PUBLIC":
      serviceCharge = 500;
      break;
    case "PRIVATE":
      serviceCharge = 550;
      break;
  }

  return serviceCharge;
};

app.listen(PORT, () => {
  console.log(`[PENSIONER_DETAIL-SERVICE] - LIVE AT PORT ${PORT}`);
});
