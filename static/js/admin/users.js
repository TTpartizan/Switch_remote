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

        // Навешиваем обработчики редактирования
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                const userRow = e.target.closest('tr');
                
                document.getElementById('userIdEdit').value = userId;
                document.getElementById('usernameInput').value = userRow.querySelector('td:nth-child(2)').textContent;
                document.getElementById('isAdminCheck').checked = 
                    userRow.querySelector('td:nth-child(3)').textContent === 'Администратор';
                
                new bootstrap.Modal(document.getElementById('userEditModal')).show();
            });
        });

        // Навешиваем обработчики удаления
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.id;
                if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                    try {
                        await fetchWithAuth(`/admin/users/${userId}`, { method: 'DELETE' });
                        alert('Пользователь успешно удален');
                        loadUsers();
                    } catch (error) {
                        console.error('Ошибка удаления пользователя:', error);
                        alert(`Ошибка: ${error.message}`);
                    }
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
