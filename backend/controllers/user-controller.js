const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');
const Comment = require('../models/comment-model')

const register = asyncHandler( async (req, res) => {
    // desestructurar un objeto
    const {name, email, password} = req.body;
    // verificar que me pasan los datos
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Faltan datos para registrar un usuario');
    }
    // verificar si existe el email (unico)
    const userExistente = await User.findOne({email});
    if(userExistente){
        res.status(400);
        throw new Error('Este email ya está asignado a un Usuario.');
    }
    // Hacer el hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Crear usuario
    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })

    res.status(201).json({
        message : 'Crear usuario',
        user
    })
})

const login = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            message : 'Login usuario',
            id : user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user.id)
        })
    }
    else{
        res.status(401);
        throw new Error('Credenciales incorrectas.');
    }
})

const generateToken = (idUsuario) => {
    return jwt.sign({idUsuario}, process.env.JWT_SECRET, {expiresIn : '48h'});
}

const showData = asyncHandler( async (req, res) => {
    res.status(200).json(req.user)
})

const showDataAdmin = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.esAdmin) {
        res.status(403);
        throw new Error('Apenas administradores pueden accesar.');
    }

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado.');
    }

    const comments = await Comment.find({ userId });

    res.status(200).json({ user, comments });
});

const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    const { userId } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('El usuario no existe.');
    }

    if (user._id.toString() !== userId && !req.user.esAdmin) {
        res.status(403);
        throw new Error('No tienes permiso para eliminar este usuario.');
    }

    await user.remove();
    res.status(203).json({ userDeleted: user });
})

const registerAdmin = asyncHandler( async (req, res) => {
    // checa si es admin, solo admins pueden crear un admin
    if (!req.user || !req.user.esAdmin) {
        res.status(403);
        throw new Error('Apenas administradores podem registrar novos administradores.');
    }
    
    // desestructurar un objeto
    const {name, email, password} = req.body;
    // verificar que me pasan los datos
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Faltan datos para registrar un usuario');
    }
    // verificar si existe el email (unico)
    const userExistente = await User.findOne({email});
    if(userExistente){
        res.status(400);
        throw new Error('Este email ya está asignado a un Usuario.');
    }
    // Hacer el hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Crear usuario
    const user = await User.create({
        name,
        email,
        password : hashedPassword,
        esAdmin : true
    })

    res.status(201).json({
        message : 'Crear usuario',
        user
    })
})

const updateUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            res.status(401);
            throw new Error('Acceso no autorizado, usuario no autenticado.');
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('El usuario no existe.');
        }

        const {name, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                name,
                email,
                password: hashedPassword
            }, 
            { new: true }
        );

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    register,
    login,
    showData,
    deleteUser,
    registerAdmin,
    showDataAdmin,
    updateUser
}