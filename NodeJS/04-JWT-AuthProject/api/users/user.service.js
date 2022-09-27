const pool = require('../../config/database');


module.exports = {
    // if we get error it will be passed as data and callback will be null
    // if execution is successful then call back will have data
    create: (data, callBack) => {
        pool.query(
            `insert into registration(firstName, lastName, gender, email, password, number)
             values(?,?,?,?,?,?)`, [data.firstName, data.lastName, data.gender, data.email, data.password, data.number],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
}