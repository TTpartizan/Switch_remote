import { loadUsers, updateUser } from './services/user_service.js';
import { loadSwitches, updateSwitch } from './services/switch_service.js';
import { loadCommands, updateCommand } from './services/command_service.js';
import { getToken } from './utils/auth.js';

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    getToken(); // Проверка токена

    // Принудительная первичная загрузка данных
    console.log('Принудительная первичная загрузка данных');
    loadUsers();
    loadSwitches();
    loadCommands();

    // Обработчики редактирования пользователей
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-user')) {
            const userId = e.target.dataset.id;
            const userRow = e.target.closest('tr');
            
            // Получаем данные из строки
            const username = userRow.querySelector('td:nth-child(2)').textContent;
            const isAdmin = userRow.querySelector('td:nth-child(3)').textContent === 'Администратор';

            // Заполняем форму
            document.getElementById('userIdEdit').value = userId;
            document.getElementById('usernameInput').value = username;
            document.getElementById('passwordInput').value = ''; // Очищаем пароль
            document.getElementById('isAdminCheck').checked = isAdmin;
            
            // Показываем модальное окно
            new bootstrap.Modal(document.getElementById('userEditModal')).show();
        }
    });

    // Обработчики редактирования коммутаторов
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-switch')) {
            const switchId = e.target.dataset.id;
            const switchRow = e.target.closest('tr');
            
            // Получаем данные из строки
            const ipAddress = switchRow.querySelector('td:nth-child(2)').textContent;
            const hostname = switchRow.querySelector('td:nth-child(3)').textContent;
            const brand = switchRow.querySelector('td:nth-child(4)').textContent;

            // Заполняем форму
            document.getElementById('switchIdEdit').value = switchId;
            document.getElementById('switchIpInput').value = ipAddress;
            document.getElementById('switchHostnameInput').value = hostname;
            document.getElementById('switchBrandInput').value = brand;
            
            // Показываем модальное окно
            new bootstrap.Modal(document.getElementById('switchEditModal')).show();
        }
    });

    // Обработчики редактирования команд
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-command')) {
            const commandId = e.target.dataset.id;
            const commandRow = e.target.closest('tr');
            
            // Получаем данные из строки
            const name = commandRow.querySelector('td:nth-child(2)').textContent;
            const template = commandRow.querySelector('td:nth-child(3)').textContent;

            // Заполняем форму
            document.getElementById('commandIdEdit').value = commandId;
            document.getElementById('commandNameInput').value = name;
            document.getElementById('commandTemplateInput').value = template;
            
            // Показываем модальное окно
            new bootstrap.Modal(document.getElementById('commandEditModal')).show();
        }
    });

    // Обработчики форм
    const userForm = document.getElementById('userForm');
    const switchForm = document.getElementById('switchForm');
    const commandForm = document.getElementById('commandForm');

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('userIdEdit').value;
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;
            const isAdmin = document.getElementById('isAdminCheck').checked;

            const userData = { username, password, is_admin: isAdmin };
            
            if (userId) {
                await updateUser(userId, userData);
            }

            bootstrap.Modal.getInstance(document.getElementById('userEditModal')).hide();
        });
    }

    if (switchForm) {
        switchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const switchId = document.getElementById('switchIdEdit').value;
            const ipAddress = document.getElementById('switchIpInput').value;
            const hostname = document.getElementById('switchHostnameInput').value;
            const brand = document.getElementById('switchBrandInput').value;

            const switchData = { 
                ip_address: ipAddress, 
                hostname: hostname, 
                brand: brand 
            };
            
            if (switchId) {
                await updateSwitch(switchId, switchData);
            }

            bootstrap.Modal.getInstance(document.getElementById('switchEditModal')).hide();
        });
    }

    if (commandForm) {
        commandForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const commandId = document.getElementById('commandIdEdit').value;
            const name = document.getElementById('commandNameInput').value;
            const template = document.getElementById('commandTemplateInput').value;

            const commandData = { name, template };
            
            if (commandId) {
                await updateCommand(commandId, commandData);
            }

            bootstrap.Modal.getInstance(document.getElementById('commandEditModal')).hide();
        });
    }
});
