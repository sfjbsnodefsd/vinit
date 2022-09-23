const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const mongoose = require("mongoose");

const coursesRoutes = require("./routes/courses");


const app = express();

// We are using MongoDB version 5.0.12
mongoose.connect(process.env.DB_CONNECTION_URI,)
.then(console.log("Connected to database"))
.catch(err => {
    console.error(err);
    console.error("DB connection failed!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//     res.send("<h1>Hello, <br>This app performs CRUD operations in MongoDB using mongoose with NodeJS.</h1>");
// });

app.use("/course", coursesRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("App is live at port ", PORT);
});