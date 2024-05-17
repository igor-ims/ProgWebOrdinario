async function deleteComment(idComment, userToken) {
    try {
        await axios.delete(`http://localhost:8000/api/comments/${idComment}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        loadUserComments();
    } catch (error) {
        console.error('Error al borrar el comentario:', error);
    }
}

function redirectToEditPage(comment) {
    localStorage.setItem('commentToEdit', JSON.stringify(comment));
    window.location.href = 'editar-comentario-form.html';
}

async function loadUserComments() {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://localhost:8000/api/comments/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const comments = response.data;
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        if (!Array.isArray(comments) || comments.length === 0) {
            const warningBox = document.createElement('div');
            warningBox.className = 'alert alert-warning';
            warningBox.textContent = '¡Usted no tiene comentarios!';
            commentsList.appendChild(warningBox);
        } else {
            comments.forEach(comment => {
                const card = document.createElement('div');
                card.className = 'card mt-3';

                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                cardHeader.textContent = "";

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = comment.title;

                const cardText = document.createElement('p');
                cardText.className = 'card-text';
                cardText.textContent = comment.text;

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-warning';
                editButton.textContent = 'Editar';
                editButton.dataset.commentId = comment._id;

                editButton.addEventListener('click', () => {
                    console.log('Editar comentario:', comment._id);
                    localStorage.setItem('commentToEdit', JSON.stringify(comment)); // Store the comment to be edited
                    window.location.href = 'editar-comentario-form.html';
                });

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger ms-2';
                deleteButton.textContent = 'Borrar';
                deleteButton.dataset.commentId = comment._id;
                deleteButton.addEventListener('click', () => {
                    const confirmed = confirm('¿Está seguro de que desea borrar este comentario?');
                    if (confirmed) {
                        console.log('Borrar comentario:', comment._id);
                        deleteComment(comment._id, token);
                    }
                });

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(editButton);
                cardBody.appendChild(deleteButton);

                card.appendChild(cardHeader);
                card.appendChild(cardBody);

                commentsList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al cargar los comentarios del usuario:', error);
    }
}

window.onload = loadUserComments;
