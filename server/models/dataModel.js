const mongoose = require("mongoose");

// defining dataSchema 

const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    viewCount: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
},
    {
        timestamps: true,
    }
);

const data = mongoose.model("data", dataSchema);
module.exports = data;
