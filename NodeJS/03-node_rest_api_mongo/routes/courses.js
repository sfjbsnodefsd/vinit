const express = require("express");
const router = express.Router();
const Course = require("../models/course");

// ROUTES
router.get("", (req, res) => {
    Course.find().then(docs => {
        res.status(200).send(docs);
    })
        .catch(err => {
            res.status(500).send({
                message: "Some error occured while fetching courses.",
                err: err
            });
        });
});

//  create a course
// router.post("", (req, res) => {
//     try {
//         Course.create(req.body);
//         res.status(201).json({
//             message: "Course created!",
//             result: result
//         });
//     } catch (err) {
//         res.json(err);
//     }
// });


router.post("", (req, res) => {
    const { title, genre, price, active } = req.body;
    const newCourse = new Course({title, genre, price, active});
    newCourse.save().then(result => {
        res.status(201).send({
            message: "Course created!",
            result: result
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error occured while creating course!",
            err: err
        });
    });
});

module.exports = router;