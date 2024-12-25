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
            const errorData = await response.json();
            console.error('Ошибка:', errorData);
            throw new Error(errorData.detail || 'Произошла ошибка');
        }

        return response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
}

// Добавляем обработчики событий сразу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');

    // Пользователи
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Форма пользователя - submit');
            
            const userId = document.getElementById('userIdEdit').value;
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;
            const isAdmin = document.getElementById('isAdminCheck').checked;

            console.log('Данные пользователя:', { userId, username, password, isAdmin });

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
    } else {
        console.error('Форма пользователя не найдена');
    }

    // Коммутаторы
    const switchForm = document.getElementById('switchForm');
    if (switchForm) {
        switchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Форма коммутатора - submit');
            
            const switchId = document.getElementById('switchIdEdit').value;
            const ipAddress = document.getElementById('switchIpInput').value;
            const hostname = document.getElementById('switchHostnameInput').value;
            const brand = document.getElementById('switchBrandInput').value;

            console.log('Данные коммутатора:', { switchId, ipAddress, hostname, brand });

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
    } else {
        console.error('Форма коммутатора не найдена');
    }

    // Команды
    const commandForm = document.getElementById('commandForm');
    if (commandForm) {
        commandForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Форма команды - submit');
            
            const commandId = document.getElementById('commandIdEdit').value;
            const name = document.getElementById('commandNameInput').value;
            const template = document.getElementById('commandTemplateInput').value;

            console.log('Данные команды:', { commandId, name, template });

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
    } else {
        console.error('Форма команды не найдена');
    }

    // Загрузка данных при открытии модальных окон
    const userModal = document.getElementById('userModal');
    const switchModal = document.getElementById('switchModal');
    const commandModal = document.getElementById('commandModal');

    if (userModal) userModal.addEventListener('show.bs.modal', loadUsers);
    if (switchModal) switchModal.addEventListener('show.bs.modal', loadSwitches);
    if (commandModal) commandModal.addEventListener('show.bs.modal', loadCommands);
});

// Функции загрузки данных (остаются прежними)
async function loadUsers() { /* ... */ }
async function loadSwitches() { /* ... */ }
async function loadCommands() { /* ... */ }
