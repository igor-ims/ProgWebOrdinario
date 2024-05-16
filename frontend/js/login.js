window.login = async function() {
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const data = await response.json();
        localStorage.setItem('userId', data.id); // Armazena o ID do usuário no localStorage
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        window.location.href = './foro.html'; // Redireciona para a página de comentários
    } catch (error) {
        console.error('Erro al login:', error);
        document.getElementById('errorMessage').textContent = 'Error: email o contraseña incorrectos.';
    }
}

window.registrar = async function() {
    try {
        const name = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('contrasena').value;

        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password})
        });

        if (!response.ok) {
            throw new Error('Error al registrar');
        }

        const data = await response.json();
        localStorage.setItem('userId', data.id); // Armazena o ID do usuário no localStorage
        localStorage.setItem('token', data.token); // Armazena o token no localStorage

        // Faz login após o registro bem-sucedido
        login();
    } catch (error) {
        console.error('Error al registrar:', error);
    }
}
