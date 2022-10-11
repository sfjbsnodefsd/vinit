const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const PensionerDetail = require("./PensionerDetail");
const PORT = process.env.PORT || 5002;
const amqp = require("amqplib");
const utils = require("./utils");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/PMS-pensioner_detail-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("[PENSIONER_DETAIL-SERVICE] - Connected to database"))
  .catch((err) => {
    console.error(err);
    console.error("[PENSIONER_DETAIL-SERVICE] - DB connection failed!");
  });

var connection, channel;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PENSIONER_DETAIL");
}

connect().then(async () => {
  channel.consume("PENSIONER_DETAIL", (data) => {
    
    const { aadhaar } = JSON.parse(data.content);
    channel.ack(data);

    PensionerDetail.findOne({ aadhaar: aadhaar })
      .then((doc) => {
        // if (doc && utils.validatePensionerDetailObject(doc)) {
          const response = {
            success: 1,
            pensioner: doc,
          };
          channel.sendToQueue(
            "PROCESS_PENSION",
            Buffer.from(JSON.stringify(response))
          );
        // } else {
        //   const response = {
        //     success: 0,
        //     err: "Internal Server Error",
        //   };
        //   channel.sendToQueue(
        //     "PROCESS_PENSION",
        //     Buffer.from(JSON.stringify(response))
        //   );
        // }
      })
      .catch((err) => {
        const response = {
          success: 0,
          err,
        };
        channel.sendToQueue(
          "PROCESS_PENSION",
          Buffer.from(JSON.stringify(response))
        );
      });
  });
});

// add a new pensioner
app.post("/pensioner", (req, res) => {
  const {
    name,
    dob,
    pan,
    aadhaar,
    salary_earned,
    allowances,
    classification,
    bank_detail,
  } = req.body;

  const newPensioner = new PensionerDetail({
    name,
    dob,
    pan,
    aadhaar,
    salary_earned,
    allowances,
    classification,
    bank_detail,
  });

  newPensioner
    .save()
    .then((r) =>
      res.status(200).json({ success: 1, createdPensioner: newPensioner })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ success: 0, message: "Some error occured", err: err })
    );
});

app.listen(PORT, () => {
  console.log(`[PENSIONER_DETAIL-SERVICE] - LIVE AT PORT ${PORT}`);
});
