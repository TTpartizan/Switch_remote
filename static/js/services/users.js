import { fetchWithAuth } from '../utils/auth.js';

export async function loadUsers() {
    try {
        const users = await fetchWithAuth('/admin/users/');
        const tbody = document.getElementById('usersTableBody');
        
        if (!tbody) {
            console.error('Элемент usersTableBody не найден');
            return;
        }
        
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = `
                <tr data-id="${user.id}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.is_admin ? 'Администратор' : 'Пользователь'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-user">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-user">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        alert(error.message);
    }
}

export async function createUser(userData) {
    console.log('Попытка создания пользователя:', userData);
    try {
        const response = await fetchWithAuth('/admin/users/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        console.log('Ответ при создании:', response);
        alert('Пользователь успешно создан');
        loadUsers();
    } catch (error) {
        console.error('Полная ошибка создания пользователя:', error);
        console.error('Тело ошибки:', error.message);
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
