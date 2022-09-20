// console.log("Hello, this is Vinit.");

const http = require('http');

function greet(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(
        {
            name: "Vinit Sharma",
            Empid: 001,
            address: {
                street : "xyz street",
                city: "Bangalore",
                state: "Karnatka"
            }
        }
    ));
    res.end();
};

// ------------------ PASSING FUNCTION ------------------ 
http.createServer(greet).listen(5000);

// ------------------ USING ARROW FUNCTION ------------------ 
// http.createServer((req, res) => {
//     res.write("Hey good job!, Your server is live on localhost:5000");
//     res.end();
// }).listen(5000);
