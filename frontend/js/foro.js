// Função para carregar os comentários do servidor e exibi-los na página
async function loadComments() {
    try {
        const token = localStorage.getItem('token'); // Pega o token do localStorage

        const response = await axios.get('http://localhost:8000/api/comments', {
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho da requisição
            }
        });

        const comments = response.data;
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = ''; // Limpar a lista de comentários antes de adicionar os novos

        comments.forEach(comment => {
            const card = document.createElement('div');
            card.className = 'card mt-3';
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = comment.username; // Nome do autor do comentário
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = comment.title; // Título do comentário
            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = comment.comment; // Conteúdo do comentário

            // Verificar se o comentário pertence ao usuário logado
            if (comment.userId === getUserId()) {
                const editButton = document.createElement('a');
                editButton.href = '#';
                editButton.className = 'btn btn-warning mr-2';
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => {
                    // Implemente a lógica para editar o comentário aqui
                    console.log('Editar comentário:', comment._id);
                });
                const deleteButton = document.createElement('a');
                deleteButton.href = '#';
                deleteButton.className = 'btn btn-danger';
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => {
                    console.log('Excluir comentario:', comment._id);
                });
                cardBody.appendChild(editButton);
                cardBody.appendChild(deleteButton);
            }
            
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            
            commentsList.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar os comentários:', error);
    }
}

function getUserId() {
    return localStorage.getItem('userId');
}

window.onload = loadComments;
