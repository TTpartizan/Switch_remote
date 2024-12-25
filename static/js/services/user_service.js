import { fetchWithAuth } from '../utils/auth.js';

export async function loadUsers() {
    try {
        console.log('Начало загрузки пользователей');
        const users = await fetchWithAuth('/admin/users/');
        
        console.log('Количество пользователей:', users.length);
        
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) {
            console.error('Элемент usersTableBody не найден');
            return;
        }
        
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

        console.log('Пользователи загружены и отображены');
    } catch (error) {
        console.error('Критическая ошибка загрузки пользователей:', error);
        alert(`Ошибка загрузки пользователей: ${error.message}`);
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
