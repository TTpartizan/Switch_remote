import { fetchWithAuth } from '../utils/auth.js';

export async function loadUsers() {
    try {
        const users = await fetchWithAuth('/admin/users/');
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.is_admin ? 'Администратор' : 'Пользователь'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-user" data-id="${user.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Навешиваем обработчики после загрузки
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                const user = users.find(u => u.id === parseInt(userId));
                
                if (user) {
                    document.getElementById('userIdEdit').value = user.id;
                    document.getElementById('usernameInput').value = user.username;
                    document.getElementById('passwordInput').value = ''; // Очищаем пароль
                    document.getElementById('isAdminCheck').checked = user.is_admin;
                    
                    new bootstrap.Modal(document.getElementById('userEditModal')).show();
                }
            });
        });

        // Навешиваем обработчики удаления
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                    deleteUser(userId);
                }
            });
        });
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        alert(error.message);
    }
}

export async function createUser(userData) {
    try {
        await fetchWithAuth('/admin/users/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        alert('Пользователь успешно создан');
        loadUsers();
    } catch (error) {
        console.error('Ошибка создания пользователя:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

export async function updateUser(userId, userData) {
    try {
        await fetchWithAuth(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        alert('Пользователь успешно обновлен');
        loadUsers();
    } catch (error) {
        console.error('Ошибка обновления пользователя:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

export async function deleteUser(userId) {
    try {
        await fetchWithAuth(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        alert('Пользователь успешно удален');
        loadUsers();
    } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert(`Ошибка: ${error.message}`);
    }
}
