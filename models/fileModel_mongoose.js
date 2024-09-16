// fileModel.js

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Marks this export as a model for a File object
 */
module.exports = mongoose.model('File', fileSchema);