import { loadUsers } from './services/user_service.js';
import { loadSwitches } from './services/switch_service.js';
import { loadCommands } from './services/command_service.js';
import { getToken } from './utils/auth.js';

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    getToken(); // Проверка токена

    // Принудительная загрузка данных при открытии модальных окон
    const userModal = document.getElementById('userModal');
    const switchModal = document.getElementById('switchModal');
    const commandModal = document.getElementById('commandModal');

    if (userModal) {
        userModal.addEventListener('show.bs.modal', () => {
            console.log('Открытие модального окна пользователей');
            loadUsers();
        });
    }

    if (switchModal) {
        switchModal.addEventListener('show.bs.modal', () => {
            console.log('Открытие модального окна коммутаторов');
            loadSwitches();
        });
    }

    if (commandModal) {
        commandModal.addEventListener('show.bs.modal', () => {
            console.log('Открытие модального окна команд');
            loadCommands();
        });
    }

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

            const userData = { username, password, is_admin: isAdmin };
            
            if (userId) {
                await updateUser(userId, userData);
            } else {
                await createUser(userData);
            }

            bootstrap.Modal.getInstance(document.getElementById('userEditModal')).hide();
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

            const switchData = { 
                ip_address: ipAddress, 
                hostname: hostname, 
                brand: brand 
            };
            
            if (switchId) {
                await updateSwitch(switchId, switchData);
            } else {
                await createSwitch(switchData);
            }

            bootstrap.Modal.getInstance(document.getElementById('switchEditModal')).hide();
        });
    }

    if (commandForm) {
        commandForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы команды');
            
            const commandId = document.getElementById('commandIdEdit').value;
            const name = document.getElementById('commandNameInput').value;
            const template = document.getElementById('commandTemplateInput').value;

            const commandData = { name, template };
            
            if (commandId) {
                await updateCommand(commandId, commandData);
            } else {
                await createCommand(commandData);
            }

            bootstrap.Modal.getInstance(document.getElementById('commandEditModal')).hide();
        });
    }

    // Принудительная первичная загрузка данных
    console.log('Принудительная первичная загрузка данных');
    loadUsers();
    loadSwitches();
    loadCommands();
});
