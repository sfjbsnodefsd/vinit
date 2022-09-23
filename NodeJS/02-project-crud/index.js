const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const PORT = 3000;

const app = express();
app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'welcome$1234',
    database: 'employeedb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log("DB connection failed " + JSON.stringify(err, undefined, 2));
    } else {
        console.log("DB connection succesful");
    }
});

app.listen(3000, () => console.log(`Express server is running on port ${PORT}`));

// get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query("select * from employee", (err, rows, fields) => {
        if (!err) {
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
        if (!err) {
            res.status(200).send(rows[0]);
        } else {
            res.status(400).send(err);
        }
    });
});

// delete employee by id
app.delete('/employee/:id', (req, res) => {
    mysqlConnection.query(`DELETE FROM employee where EmpID = ${req.params.id}`, (err, rows, fields) => {
        if (!err) {
            res.status(200).send({ message: 'Deleted succesfully' });
        } else {
            res.status(400).send(err);
        }
    });
});


/** ************************************************************************************************************

            @POST METHOD (create new employee)
            1. Using simple SQL query
            2. Using stored procedure
*/

//  ----- 1. Using SQL query ---------

// app.post('/employee', (req, res) => {
//     const {name, emp_code, salary} = req.body;
//     INSERT_EMPLOYEE(res, name, emp_code, salary);
// });

//  ----- 2.Using stored procedure ---------

app.post('/employee', (req, res) => {
    let { emp_id, name, emp_code, salary } = req.body;
    emp_id = emp_id ? emp_id : 0;
    var sql = "SET @EmpID = ?; SET @Name= ? ; SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql, [emp_id, name, emp_code, salary], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).send({
                        message: "insertion successful",
                        "EmpID": element[0].EmpID
                    });
                }
            });
        } else {
            res.status(400).send({ "error_message": err });
        }
    });
});

//  ************************************************************************************************************

/** ************************************************************************************************************
 * @PUT METHOD (update or create new employee)
            1. Using simple SQL query
            2. Using stored procedure
*/

//  ----- 1. Using SQL query ---------

// app.put('/employee/:id', async (req, res) => {
//     const { name, emp_code, salary } = req.body;
//     const { id } = req.params;
//     // check if id exists
//     mysqlConnection.query(`SELECT EmpID FROM employee where EmpID=${id}`, (err, rows, fields) => {
//         if (!err) {
//             if (rows && rows.length > 0) {
//                 UPDATE_EMPLOYEE(res, name, emp_code, salary, id);
//             } else {
//                 INSERT_EMPLOYEE(res, name, emp_code, salary, id);
//             }
//         }
//     });
// });

//  ----- 2.Using stored procedure (This won't create since procedure logic doesn't cover it) ---------

app.put('/employee/:id', async (req, res) => {
    const { name, emp_code, salary } = req.body;
    const emp_id = req.params.id;
    var sql = "SET @EmpID = ?; SET @Name= ? ; SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql, [emp_id, name, emp_code, salary], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(200).send({
                        message: "update successful",
                        "EmpID": element[0].EmpID
                    });
                }
            });
        } else {
            res.status(400).send({ "error_message": err });
        }
    });
});


//  ************************************************************************************************************


/** ************************************************************************************************************
 * @HELPER_METHODS
*/

const INSERT_EMPLOYEE = (res, name, emp_code, salary, emp_id = undefined) => {
    const query = `INSERT INTO employee (${emp_id ? EmpID + ',' : ''}Name, EmpCode, Salary) VALUES(${emp_id ? emp_id + ',' : ''}'${name}', '${emp_code}', ${salary});`
    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            res.status(201).send(rows);
        } else {
            res.status(400).send(err);
        }
    });
};

const UPDATE_EMPLOYEE = (res, name, emp_code, salary, emp_id) => {
    const query = `UPDATE employee SET Name = '${name}', EmpCode='${emp_code}', Salary = ${salary} WHERE EmpID=${emp_id};`
    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            res.status(200).send(rows);
        } else {
            res.status(400).send(err);
        }
    });
};

//  ************************************************************************************************************