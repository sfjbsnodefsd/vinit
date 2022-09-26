const { response } = require("express");
const express = require("express");
const course = require("../models/course");
const router = express.Router();
const Course = require("../models/course");


// ********************************************************************************************************************************************

/*
    * GET all courses
    * @params -> none
    * @body -> none
*/

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


// ********************************************************************************************************************************************

/*
    * CREATE a course
    * @params -> none
    * @body -> title, genre, price, active (everything is mandatory)
*/

// ---------------------- Method 1 ----------------------------

router.post("", async (req, res) => {
    try {
        const result = await Course.create(req.body);
        res.status(201).json({
            message: "Course created!",
            result: result
        });
    } catch (err) {
        res.json(err);
    }
});

// ---------------------- Method 2 ----------------------------


// router.post("", (req, res) => {
//     const { title, genre, price, active } = req.body;
//     const newCourse = new Course({title, genre, price, active});
//     newCourse.save().then(result => {
//         res.status(201).send({
//             message: "Course created!",
//             result: result
//         });
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: "Error occured while creating course!",
//             err: err
//         });
//     });
// });
// ********************************************************************************************************************************************


/*
    * GET a course by id
    * @params -> id
    * @body -> none
*/
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Course.findById(id)
        .then(doc => {
            if (doc) res.status(200).json(doc);
            else res.status(400).json({ message: `No course with id ${id} exists` });
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// ********************************************************************************************************************************************


/*
    * UPDATE a course by id
    * @params -> id
    * @body -> title, genre, price, active (nothing is mandatory)
*/

// ---------------------- Method 1 ----------------------------
// router.put("/:id", (req, res) => {
//     const { title, genre, price, active } = req.body;
//     const update = { title, genre, price, active };
//     Course.findByIdAndUpdate(req.params.id, update)
//         .then(r => res.status(200).json({ message: "Course updated successfully", original_document: r }))
//         .catch(err => res.status(500).json(err));
// });

// ---------------------- Method 2 ----------------------------
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await Course.updateOne({ _id: id }, req.body);
        res.json({ message: "Updated succesfully!", response: response });
    } catch (err) {
        res.status(500).json({
            message: "An error occured!",
            err: err
        });
    }
});

// ********************************************************************************************************************************************

/*
    * DELETE a course by id
    * @params -> id
    * @body -> null
*/

// ---------------------- Method 1 ----------------------------

// router.delete("/:id", (req, res) => {
//     Course.findByIdAndDelete(req.params.id)
//     .then(r => res.status(200).json({message: "Course Deleted Successfully!", deleted_course: r}))
//     .catch(err => res.status(500).json(err));
// });

// ---------------------- Method 2 ----------------------------

router.delete("/:id", async (req, res) => {
    try {
        await Course.remove({ _id: req.params.id });
        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (err) {
        res.status(500).json();
    }
});

module.exports = router;