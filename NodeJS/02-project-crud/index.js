const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const PORT = 3000;

const app = express();
app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'welcome$1234',
    database: 'employeedb'
});

mysqlConnection.connect((err) => {
    if(err) {
        console.log("DB connection failed " + JSON.stringify(err, undefined, 2));
    } else {
        console.log("DB connection succesful");
    }
});

app.listen(3000, () => console.log(`Express server is running on port ${PORT}`));

// get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query("select * from employee", (err, rows, fields) => {
        if(!err) {
            res.status(200).send(rows);
        } else {
            console.log(err);
        }
    });
});

// get employee by id
app.get('/employee/:id', (req, res) => {
    // mysqlConnection.query("select * from employee where EmpID = ?", [req.params.id], (err, rows, fields) => {
    mysqlConnection.query(`select * from employee where EmpID = ${req.params.id}`, (err, rows, fields) => {
        if(!err) {
            res.status(200).send(rows[0]);
        } else {
            res.status(400).send(err);
        }
    });
});

// delete employee by id
app.delete('/employee/:id', (req, res) => {
    mysqlConnection.query(`DELETE FROM employee where EmpID = ${req.params.id}`, (err, rows, fields) => {
        if(!err) {
            res.status(200).send({message:'Deleted succesfully'});
        } else {
            res.status(400).send(err);
        }
    });
});

// create new employee
// app.post('/employee', (req, res) => {
//     mysqlConnection.query(`INSERT INTO employee`)
// });