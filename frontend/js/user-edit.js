async function loadUserInfo() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/data', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = response.data;

        if (userData) {
            document.getElementById('usernameInput').value = userData.name;
            document.getElementById('emailInput').value = userData.email;
        } else {
            console.error('Error: No se encontraron datos de usuario.');
        }
    } catch (error) {
        console.error('Error al cargar los datos de usuario:', error);
    }
}

window.onload = loadUserInfo;

function cancelEdit(){
    window.location.href = '../html/foro.html';
}

async function editUser(){
    try {
        const userName = document.getElementById('usernameInput').value;
        const userEmail = document.getElementById('emailInput').value;
        const currentPassword = document.getElementById('currentPasswordInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const newPasswordConfirm = document.getElementById('newPasswordConfirmInput').value;

        const token = localStorage.getItem('token');
        
        const login = await axios.post('http://localhost:8000/api/users/login', {
            email: userEmail,
            password: currentPassword
        });

        const userData = login.data;

        if (userData.email === userEmail) {
            const userId = localStorage.getItem('userId');
            let requestBody = {
                name: userName,
                email: userEmail,
            };

            if (newPassword.trim() !== '') {
                if (newPassword === newPasswordConfirm) {
                    requestBody.password = newPassword;
                } else {
                    alert('Error: Nuevas Contrasenas diferentes.')
                    return;
                }
            } else {
                requestBody.password = currentPassword;
            }

            await axios.put(`http://localhost:8000/api/users/${userId}`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await updateCommentNames(userId, userName, token);

             window.location.href = '../html/foro.html';
        } else {
            alert('Error: No se encontraron datos de usuario.');
        }
    } catch (error) {
        alert('Error al cargar los datos de usuario: contraseña actual incorrecta. ', error);
        console.error('Error al cargar los datos de usuario:', error);
    }
}


async function updateCommentNames(userId, userName, token){
    try {
        await axios.patch(`http://localhost:8000/api/comments/${userId}`, {
            name: userName,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error al actualizar los nombres de usuario en los comentarios:', error);
    }
}

