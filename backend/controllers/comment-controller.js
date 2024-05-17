const asyncHandler = require('express-async-handler');

const Comment = require('../models/comment-model');
const User = require('../models/user-model');
const mongoose = require('mongoose')

const getComments = asyncHandler ( async(req, res) => {
    const comments = await Comment.find();
    res.status(200).json(comments);
} )

const getCommentsUser = asyncHandler ( async(req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Acceso no autorizado. Usuario no autenticado.');
    }

    const userId = req.params.id;

    const comments = await Comment.find({ user : userId });

    res.status(200).json(comments);
} )

const crearComments = asyncHandler ( async(req, res) => {
    if(!req.body.text || !req.body.title){
        res.status(400);
        throw new Error( 'Por favor teclea un comentario con titulo.' );
    }

    const user = await User.findById(req.user.id);

    const comentario = await Comment.create(
        {
            title : req.body.title,
            text : req.body.text,
            user : req.user.id,
            name : user.name
        }
    )

    res.status(201).json(comentario);
} )

const updateNameAfterUpdatingUser = asyncHandler(async(req, res) =>{
    try {
        const comments = await Comment.find({ user: req.params.id });

        if (!comments || comments.length === 0) {
            res.status(200).json({ message: 'No se encontraron comentarios para este usuario.' });
            return;
        }

        await Promise.all(comments.map(async (comment) => {
            await Comment.findByIdAndUpdate(comment._id, { name: req.body.name }, { new: true });
        }));

        res.status(200).json({ message: 'Nombres de usuario actualizados en todos los comentarios.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const updateComment = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            res.status(401);
            throw new Error('Acceso no autorizado, usuario no autenticado.');
        }

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404);
            throw new Error('El comentario no existe.');
        }

        if (comment.user.toString() !== req.user.id) {
            res.status(403);
            throw new Error('No tienes permiso para modificar este comentario.');
        }

        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({ updatedComment });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
        res.status(404);
        throw new Error('El comentario no existe.');
    }

    if (comment.user.toString() !== req.user.id && !req.user.esAdmin) {
        res.status(403);
        throw new Error('No tienes permiso para eliminar este comentario.');
    }

    await comment.deleteOne()
    res.status(203).json({ commentDeleted: comment });
});



module.exports = {
    getComments,
    getCommentsUser,
    crearComments,
    updateComment,
    deleteComment,
    updateNameAfterUpdatingUser
}