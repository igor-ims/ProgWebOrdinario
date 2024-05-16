import { Timestamp } from 'mongodb';
import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    title : {
        type : String,
        required : [true, 'Por favor teclea un titulo']
    },
    text : {
        type : String,
        required : [true, 'Por favor teclea un comentario']
    }
}, { timestamps : true })

export default model('Comment', commentSchema);