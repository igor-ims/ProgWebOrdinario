document.addEventListener('DOMContentLoaded', () => {
    const commentToEdit = localStorage.getItem('commentToEdit');
    if (commentToEdit) {
        const comment = JSON.parse(commentToEdit);

        document.getElementById('titleInput').value = comment.title;
        document.getElementById('commentInput').value = comment.text;
        document.getElementById('commentId').value = comment._id; // Store the comment ID in hidden input
    }
});

async function submitChanges() {
    const title = document.getElementById('titleInput').value;
    const text = document.getElementById('commentInput').value;
    const commentId = document.getElementById('commentId').value;
    const token = localStorage.getItem('token');

    try {
        await axios.put(`http://localhost:8000/api/comments/${commentId}`, {
            title,
            text
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Optionally clear the localStorage
        localStorage.removeItem('commentToEdit');

        // Redirect back to the comments page or another appropriate page
        window.location.href = 'foro-mis-comentarios.html';
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
    }
}
