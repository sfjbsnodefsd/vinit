const express = require("express");
const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://localhost:27017/PMS-auth-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(console.log("[AUTH-SERVICE] - Connected to database"))
    .catch(err => {
        console.error(err);
        console.error("[AUTH-SERVICE] - DB connection failed!");
    });

const app = express();

app.use(express.json());

// register
app.post("/auth/reg", async (req, res) => {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ success: 0, message: "User already exists" });
    } else {
        const newUser = new User({ name, email, password });
        newUser.save();
        return res.status(201).json({
            success: 1,
            newUser
        });
    };
});

// login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: 0,
            message: "User does not exist!"
        });
    }

    if (password !== user.password) {
        return res.status(401).json({success: 0, message: "Incorrect password"});
    }

    const payload = { email, name: user.name };
    jwt.sign(payload, "secret", (err, token) => {
        if (err) {
            return res.status(500).json({ success: 0, message: "Internal server error!" });
        }
        return res.status(200).json({
            success: 1,
            token: token
        })
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`[AUTH-SERVICE] - LIVE AT PORT ${PORT}`);
});