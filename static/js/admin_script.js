// Получаем токен из localStorage
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

// Функция для выполнения запросов с авторизацией
async function fetchWithAuth(url, options = {}) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Произошла ошибка');
    }

    return response.json();
}

// Пользователи
async function loadUsers() {
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
    } catch (error) {
        alert(error.message);
    }
}

// Коммутаторы
async function loadSwitches() {
    try {
        const switches = await fetchWithAuth('/admin/switches/');
        const tbody = document.getElementById('switchesTableBody');
        tbody.innerHTML = '';
        switches.forEach(sw => {
            const row = `
                <tr>
                    <td>${sw.id}</td>
                    <td>${sw.ip_address}</td>
                    <td>${sw.hostname}</td>
                    <td>${sw.brand}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-switch" data-id="${sw.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-switch" data-id="${sw.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        alert(error.message);
    }
}

// Команды
async function loadCommands() {
    try {
        const commands = await fetchWithAuth('/admin/commands/');
        const tbody = document.getElementById('commandsTableBody');
        tbody.innerHTML = '';
        commands.forEach(cmd => {
            const row = `
                <tr>
                    <td>${cmd.id}</td>
                    <td>${cmd.name}</td>
                    <td>${cmd.template}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-command" data-id="${cmd.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-command" data-id="${cmd.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        alert(error.message);
    }
}

// Загрузка данных при открытии модальных окон
document.getElementById('userModal').addEventListener('show.bs.modal', loadUsers);
document.getElementById('switchModal').addEventListener('show.bs.modal', loadSwitches);
document.getElementById('commandModal').addEventListener('show.bs.modal', loadCommands);

// Обработчики для добавления сущностей
document.getElementById('addUserBtn').addEventListener('click', () => {
    document.getElementById('userIdEdit').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('isAdminCheck').checked = false;
    new bootstrap.Modal(document.getElementById('userEditModal')).show();
});

document.getElementById('addSwitchBtn').addEventListener('click', () => {
    document.getElementById('switchIdEdit').value = '';
    document.getElementById('switchIpInput').value = '';
    document.getElementById('switchHostnameInput').value = '';
    document.getElementById('switchBrandInput').value = 'cisco_ios';
    new bootstrap.Modal(document.getElementById('switchEditModal')).show();
});

document.getElementById('addCommandBtn').addEventListener('click', () => {
    document.getElementById('commandIdEdit').value = '';
    document.getElementById('commandNameInput').value = '';
    document.getElementById('commandTemplateInput').value = '';
    new bootstrap.Modal(document.getElementById('commandEditModal')).show();
});

// Остальной функционал (редактирование, удаление) будет добавлен позже
