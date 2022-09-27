const express = require("express");
require("dotenv").config();
const userRouter = require("./api/users/user.router");

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    console.log("App is live at port ", PORT);
});