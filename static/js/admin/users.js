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

        // Навешиваем обработчики редактирования
        tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-user')) {
                const row = e.target.closest('tr');
                const userId = row.dataset.id;
                
                const usernameInput = document.getElementById('usernameInput');
                const isAdminCheck = document.getElementById('isAdminCheck');
                const userIdEdit = document.getElementById('userIdEdit');

                if (usernameInput && isAdminCheck && userIdEdit) {
                    userIdEdit.value = userId;
                    usernameInput.value = row.querySelector('td:nth-child(2)').textContent;
                    isAdminCheck.checked = row.querySelector('td:nth-child(3)').textContent === 'Администратор';
                    
                    new bootstrap.Modal(document.getElementById('userEditModal')).show();
                }
            }
        });

        // Навешиваем обработчики удаления
        tbody.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-user')) {
                const row = e.target.closest('tr');
                const userId = row.dataset.id;
                
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
            }
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
