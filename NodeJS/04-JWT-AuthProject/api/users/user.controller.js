const { hashSync, genSaltSync, compareSync } = require('bcrypt');
const pool = require('../../config/database');
const { create, getUsers, getUserById, updateUser, deleteUser, getUserByUserEmail } = require('./user.service');
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(201).json({
                success: 1,
                data: results
            });
        });
    },

    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    err: err
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },

    getUserById: (req, res) => {
        getUserById(req.params.id, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    err: err
                });
            }
            if (!results) {
                return res.status(400).json({
                    success: 0,
                    message: "No record found!"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const data = { ...req.body, id };
        const salt = genSaltSync(10);

        data.password = hashSync(data.password, salt);
        updateUser(data, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    err: err
                });
            }
            if (results.affectedRows === 0) {
                return res.status(400).json({
                    success: 0,
                    message: "No record found for user id",
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Updated successfully",
                // data: results
            });
        })
    },

    deleteUser: (req, res) => {
        deleteUser(req.params.id, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    err: err
                });
            }
            if (results.affectedRows === 0) {
                return res.status(400).json({
                    success: 0,
                    message: "No record found for user id",
                });
            }
            return res.status(200).json({
                success: 1,
                message: "User deleted successfully",
            });
        });
    },
    login: (req, res) => {
        const { email, password } = req.body;
        getUserByUserEmail(email, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Internal server error",
                    err: err
                });
            }
            if (!result) {
                return res.status(401).json({
                    success: 0,
                    message: "Invalid email",
                });
            }
            const isPassValid = compareSync(password, result.password);
            if (isPassValid) {
                result.password = undefined;
                const jsontoken = sign({ result }, process.env.JWT_SECRET_KEY, {
                    expiresIn: "1h",
                });
                return res.status(200).json({
                        success: 1,
                        message: "Login successful",
                        token: jsontoken
                    });
            } else {
                return res.status(401).json({
                    success: 0,
                    message: 'Incorrect password'
                });
            }
        });
    }
};