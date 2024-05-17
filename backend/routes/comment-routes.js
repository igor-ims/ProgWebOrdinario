const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth-middleware');
const {getComments, crearComments, updateComment, deleteComment, getCommentsUser, updateNameAfterUpdatingUser} = require('../controllers/comment-controller');


router.route('/').get(protect, getComments).post(protect, crearComments);

router.route('/:id')
    .get(protect, getCommentsUser)
    .delete(protect, deleteComment)
    .put(protect, updateComment)
    .patch(protect, updateNameAfterUpdatingUser);

module.exports = router;