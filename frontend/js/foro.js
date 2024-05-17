async function loadComments() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/comments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const comments = response.data;
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        if (comments.length === 0) {
            const warningBox = document.createElement('div');
            warningBox.className = 'alert alert-warning';
            warningBox.textContent = '¡No hay comentarios en el foro!';
            commentsList.appendChild(warningBox);
        } else {
            comments.forEach(comment => {
                const card = document.createElement('div');
                card.className = 'card mt-3';
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                cardHeader.textContent = comment.name;
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = comment.title;
                const cardText = document.createElement('p');
                cardText.className = 'card-text';
                cardText.textContent = comment.text;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);

                card.appendChild(cardHeader);
                card.appendChild(cardBody);

                commentsList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al cargar los comentarios:', error);
    }
}

window.onload = loadComments;

function finalizarSesion() {
    localStorage.clear();
    window.location.href = "../index.html";
}

