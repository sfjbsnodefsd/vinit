const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to JWT Tutorial.")
});

app.get("/api", (req, res) => {
    res.json({
        success: 1,
        message: "This rest api is working"
    });
});

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    console.log("App is live at port ", PORT);
});