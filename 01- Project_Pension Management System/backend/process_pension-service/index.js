const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5001;
const amqp = require("amqplib");
const isAuthenticated = require("../isAuthenticated");

const app = express();
app.use(express.json());

var connection, channel;
var response_from_pensioner_detail;

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
    response_from_pensioner_detail = JSON.parse(data.content);
    channel.ack(data);
  });
  
  try {
    if (!response_from_pensioner_detail.success) {
      throw new Error(response_from_pensioner_detail.err);
    }
    const { classification, salary_earned, allowances, bank_detail } =
      response_from_pensioner_detail.pensioner;
    const pensionPercentage = getPensionPercentage(classification);
    if (pensionPercentage === null) {
      console.error("[DEBUG] Provided Pension classifation is not supported");
      throw new Error("Internal Server Error");
    }

    const PensionAmount = (80 * salary_earned) / 100 + allowances;
    const ServiceCharge = getBankServiceCharge(bank_detail.bank_type);
    if (ServiceCharge === null) {
      console.error("[DEBUG] Provided Bank classifation is not supported");
      throw new Error("Internal Server Error");
    }

    return res.status(200).json({
      success: 1,
      pensionDetail: {
        PensionAmount,
        ServiceCharge,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: 0,
      err: err,
    });
  }
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
