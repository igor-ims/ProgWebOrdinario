const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model');

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Por favor teclea un titulo']
    },
    text: {
        type: String,
        required: [true, 'Por favor teclea un comentario']
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);