const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`AUTH-SERVICE LIVE AT PORT ${PORT}`);
});