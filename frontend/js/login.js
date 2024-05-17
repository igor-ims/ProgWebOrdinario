window.login = async function() {
    try {
        const correo = document.getElementById('email').value;
        const contrasena = document.getElementById('contrasena').value;

        const response = await fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email : correo, password : contrasena })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const data = await response.json();
        localStorage.setItem('userId', data.id);
        localStorage.setItem('token', data.token);
        window.location.href = '../html/foro.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').textContent = 'Error: email o contraseña incorrectos.';
    }
}


window.registrar = async function() {
    try {
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('email').value;
        const contrasena = document.getElementById('contrasena').value;

        const response = await fetch('http://localhost:8000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name : nombre, email : correo, password : contrasena})
        });

        if (!response.ok) {
            throw new Error('Error al registrar');
        }

        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('token', data.token);

        login();
    } catch (error) {
        console.error('Error al registrar:', error);
    }
}

