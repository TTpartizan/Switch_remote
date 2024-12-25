// Получаем токен из localStorage
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

// Функция для выполнения запросов с авторизацией
async function fetchWithAuth(url, options = {}) {
    console.log('Запрос:', url, options);
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        console.log('Ответ:', response);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Ошибка:', errorData);
            throw new Error(errorData || 'Произошла ошибка');
        }

        return response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
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
        console.error('Ошибка загрузки пользователей:', error);
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
        console.error('Ошибка загрузки коммутаторов:', error);
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
        console.error('Ошибка загрузки команд:', error);
        alert(error.message);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');

    // Обработчики для кнопок добавления
    const addUserBtn = document.getElementById('addUserBtn');
    const addSwitchBtn = document.getElementById('addSwitchBtn');
    const addCommandBtn = document.getElementById('addCommandBtn');

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            console.log('Нажата кнопка добавления пользователя');
            document.getElementById('userIdEdit').value = '';
            document.getElementById('usernameInput').value = '';
            document.getElementById('passwordInput').value = '';
            document.getElementById('isAdminCheck').checked = false;
            new bootstrap.Modal(document.getElementById('userEditModal')).show();
        });
    }

    if (addSwitchBtn) {
        addSwitchBtn.addEventListener('click', () => {
            console.log('Нажата кнопка добавления коммутатора');
            document.getElementById('switchIdEdit').value = '';
            document.getElementById('switchIpInput').value = '';
            document.getElementById('switchHostnameInput').value = '';
            document.getElementById('switchBrandInput').value = 'cisco_ios';
            new bootstrap.Modal(document.getElementById('switchEditModal')).show();
        });
    }

    if (addCommandBtn) {
        addCommandBtn.addEventListener('click', () => {
            console.log('Нажата кнопка добавления команды');
            document.getElementById('commandIdEdit').value = '';
            document.getElementById('commandNameInput').value = '';
            document.getElementById('commandTemplateInput').value = '';
            new bootstrap.Modal(document.getElementById('commandEditModal')).show();
        });
    }

    // Обработчики форм
    const userForm = document.getElementById('userForm');
    const switchForm = document.getElementById('switchForm');
    const commandForm = document.getElementById('commandForm');

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы пользователя');
            
            const userId = document.getElementById('userIdEdit').value;
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;
            const isAdmin = document.getElementById('isAdminCheck').checked;

            try {
                const userData = { username, password, is_admin: isAdmin };
                
                if (userId) {
                    await fetchWithAuth(`/admin/users/${userId}`, {
                        method: 'PUT',
                        body: JSON.stringify(userData)
                    });
                } else {
                    await fetchWithAuth('/admin/users/', {
                        method: 'POST',
                        body: JSON.stringify(userData)
                    });
                }

                alert('Пользователь успешно сохранен');
                bootstrap.Modal.getInstance(document.getElementById('userEditModal')).hide();
                loadUsers();
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    }

    if (switchForm) {
        switchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы коммутатора');
            
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
                    await fetchWithAuth(`/admin/switches/${switchId}`, {
                        method: 'PUT',
                        body: JSON.stringify(switchData)
                    });
                } else {
                    await fetchWithAuth('/admin/switches/', {
                        method: 'POST',
                        body: JSON.stringify(switchData)
                    });
                }

                alert('Коммутатор успешно сохранен');
                bootstrap.Modal.getInstance(document.getElementById('switchEditModal')).hide();
                loadSwitches();
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    }

    if (commandForm) {
        commandForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы команды');
            
            const commandId = document.getElementById('commandIdEdit').value;
            const name = document.getElementById('commandNameInput').value;
            const template = document.getElementById('commandTemplateInput').value;

            try {
                const commandData = { name, template };
                
                if (commandId) {
                    await fetchWithAuth(`/admin/commands/${commandId}`, {
                        method: 'PUT',
                        body: JSON.stringify(commandData)
                    });
                } else {
                    await fetchWithAuth('/admin/commands/', {
                        method: 'POST',
                        body: JSON.stringify(commandData)
                    });
                }

                alert('Команда успешно сохранена');
                bootstrap.Modal.getInstance(document.getElementById('commandEditModal')).hide();
                loadCommands();
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    }

    // Загрузка данных при открытии модальных окон
    const userModal = document.getElementById('userModal');
    const switchModal = document.getElementById('switchModal');
    const commandModal = document.getElementById('commandModal');

    if (userModal) userModal.addEventListener('show.bs.modal', loadUsers);
    if (switchModal) switchModal.addEventListener('show.bs.modal', loadSwitches);
    if (commandModal) commandModal.addEventListener('show.bs.modal', loadCommands);
});
