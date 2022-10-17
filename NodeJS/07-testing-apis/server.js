const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
    console.log('Testing app is live on PORT ', PORT);
});