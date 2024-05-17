const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth-middleware')

const {login, register, showData, showDataAdmin, deleteUser, registerAdmin, updateUser} = require('../controllers/user-controller')

router.post('/login', login);
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.get('/data', protect, showData);
router.get('/data-admin', protect, showDataAdmin);
router.delete('/delete/:id', protect, deleteUser);
router.put('/:id', protect, updateUser);

module.exports = router;