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

// Создание пользователя
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userIdEdit').value;
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const isAdmin = document.getElementById('isAdminCheck').checked;

    try {
        const userData = { username, password, is_admin: isAdmin };
        
        if (userId) {
            // Обновление существующего пользователя
            await fetchWithAuth(`/admin/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
        } else {
            // Создание нового пользователя
            await fetchWithAuth('/admin/users/', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        }

        // Закрываем модальное окно и обновляем список
        bootstrap.Modal.getInstance(document.getElementById('userEditModal')).hide();
        loadUsers();
    } catch (error) {
        alert(error.message);
    }
});

// Создание коммутатора
document.getElementById('switchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const switchId = document.getElementById('switchIdEdit').value;
    const ipAddress = document.getElementById('switchIpInput').value;
    const hostname = document.getElementById('switchHostnameInput').value;
    const brand = document.getElementById('switchBrandInput').value;

    try {
        const switchData = { 
            ip_address: ipAddress, 
            hostname: hostname, 
            brand: brand 
        };
        
        if (switchId) {
            // Обновление существующего коммутатора
            await fetchWithAuth(`/admin/switches/${switchId}`, {
                method: 'PUT',
                body: JSON.stringify(switchData)
            });
        } else {
            // Создание нового коммутатора
            await fetchWithAuth('/admin/switches/', {
                method: 'POST',
                body: JSON.stringify(switchData)
            });
        }

        // Закрываем модальное окно и обновляем список
        bootstrap.Modal.getInstance(document.getElementById('switchEditModal')).hide();
        loadSwitches();
    } catch (error) {
        alert(error.message);
    }
});

// Создание команды
document.getElementById('commandForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const commandId = document.getElementById('commandIdEdit').value;
    const name = document.getElementById('commandNameInput').value;
    const template = document.getElementById('commandTemplateInput').value;

    try {
        const commandData = { name, template };
        
        if (commandId) {
            // Обновление существующей команды
            await fetchWithAuth(`/admin/commands/${commandId}`, {
                method: 'PUT',
                body: JSON.stringify(commandData)
            });
        } else {
            // Создание новой команды
            await fetchWithAuth('/admin/commands/', {
                method: 'POST',
                body: JSON.stringify(commandData)
            });
        }

        // Закрываем модальное окно и обновляем список
        bootstrap.Modal.getInstance(document.getElementById('commandEditModal')).hide();
        loadCommands();
    } catch (error) {
        alert(error.message);
    }
});

// Загрузка данных при открытии модальных окон
document.getElementById('userModal').addEventListener('show.bs.modal', loadUsers);
document.getElementById('switchModal').addEventListener('show.bs.modal', loadSwitches);
document.getElementById('commandModal').addEventListener('show.bs.modal', loadCommands);
