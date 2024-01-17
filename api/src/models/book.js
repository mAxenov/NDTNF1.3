const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
    id: {
        type: "string",
        require: true
    },
    title: {
        type: "string",
        require: true
    },
    description: {
        type: "string"
    },
    authors: {
        type: "string"
    },
    favorite: {
        type: "string"
    },
    fileCover: {
        type: "string"
    },
    fileName: {
        type: "string"
    }
});

module.exports = model('Book', bookSchema);