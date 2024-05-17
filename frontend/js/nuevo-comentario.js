async function submitComment() {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const title = document.getElementById('title').value;
        const text = document.getElementById('text').value;

        const commentResponse = await axios.post('http://localhost:8000/api/comments', {
            title: title,
            text: text,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (commentResponse.status === 201) {
            window.location.href = '../html/foro.html';
        } else {
            throw new Error('Error al crear el comentario');
        }
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').textContent = 'Error al crear el comentario. Intente nuevamente.';
    }
}
