const express = require('express');

const app = express();

app.get('/test', (req, res) => {
    res.send('Hi, in this app we are going to test APIs using jest and supertest.');
});

app.get("/test/subjects", (req, res) => {
    res.send(['maths', 'science', 'IT']);
});

module.exports =  app;