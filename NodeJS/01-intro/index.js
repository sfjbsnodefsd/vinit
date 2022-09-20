// console.log("Hello, this is Vinit.");

const http = require('http');

function greet(req, res) {
    res.write("<h1>Hello from Node Http server.</h1>");
    res.end();
}

// ------------------ PASSING FUNCTION ------------------ 
http.createServer(greet).listen(5000);

// ------------------ USING ARROW FUNCTION ------------------ 
// http.createServer((req, res) => {
//     res.write("Hey good job!, Your server is live on localhost:5000");
//     res.end();
// }).listen(5000);
