const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    active: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('Course', courseSchema);