import { loadUsers, createUser, updateUser } from './services/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './services/switches.js';
import { loadCommands, createCommand, updateCommand } from './services/commands.js';
import { getToken } from './utils/auth.js';

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    
    try {
        getToken(); // Проверка токена

        // Загрузка данных
        loadUsers();
        loadSwitches();
        loadCommands();

        // Обработчики кнопок добавления
        const addUserBtn = document.getElementById('addUserBtn');
        const addSwitchBtn = document.getElementById('addSwitchBtn');
        const addCommandBtn = document.getElementById('addCommandBtn');

        // Пользователи
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                console.log('Нажата кнопка добавления пользователя');
                const userIdEdit = document.getElementById('userIdEdit');
                const usernameInput = document.getElementById('usernameInput');
                const passwordInput = document.getElementById('passwordInput');
                const isAdminCheck = document.getElementById('isAdminCheck');

                if (userIdEdit && usernameInput && passwordInput && isAdminCheck) {
                    userIdEdit.value = '';
                    usernameInput.value = '';
                    passwordInput.value = '';
                    isAdminCheck.checked = false;
                    
                    new bootstrap.Modal(document.getElementById('userEditModal')).show();
                } else {
                    console.error('Не найдены элементы формы пользователя');
                    // Диагностика
                    console.log('Элементы:', {
                        userIdEdit: !!userIdEdit,
                        usernameInput: !!usernameInput,
                        passwordInput: !!passwordInput,
                        isAdminCheck: !!isAdminCheck
                    });
                }
            });
        } else {
            console.error('Кнопка добавления пользователя не найдена');
        }

        // Коммутаторы
        if (addSwitchBtn) {
            addSwitchBtn.addEventListener('click', () => {
                console.log('Нажата кнопка добавления коммутатора');
                const switchIdEdit = document.getElementById('switchIdEdit');
                const switchIpInput = document.getElementById('switchIpInput');
                const switchHostnameInput = document.getElementById('switchHostnameInput');
                const switchBrandInput = document.getElementById('switchBrandInput');

                if (switchIdEdit && switchIpInput && switchHostnameInput && switchBrandInput) {
                    switchIdEdit.value = '';
                    switchIpInput.value = '';
                    switchHostnameInput.value = '';
                    switchBrandInput.value = 'cisco_ios';
                    
                    new bootstrap.Modal(document.getElementById('switchEditModal')).show();
                } else {
                    console.error('Не найдены элементы формы коммутатора');
                    // Диагностика
                    console.log('Элементы:', {
                        switchIdEdit: !!switchIdEdit,
                        switchIpInput: !!switchIpInput,
                        switchHostnameInput: !!switchHostnameInput,
                        switchBrandInput: !!switchBrandInput
                    });
                }
            });
        } else {
            console.error('Кнопка добавления коммутатора не найдена');
        }

        // Команды
        if (addCommandBtn) {
            addCommandBtn.addEventListener('click', () => {
                console.log('Нажата кнопка добавления команды');
                const commandIdEdit = document.getElementById('commandIdEdit');
                const commandNameInput = document.getElementById('commandNameInput');
                const commandTemplateInput = document.getElementById('commandTemplateInput');
                const variablesContainer = document.getElementById('variablesContainer');

                if (commandIdEdit && commandNameInput && commandTemplateInput && variablesContainer) {
                    commandIdEdit.value = '';
                    commandNameInput.value = '';
                    commandTemplateInput.value = '';
                    variablesContainer.innerHTML = '';
                    
                    new bootstrap.Modal(document.getElementById('commandEditModal')).show();
                } else {
                    console.error('Не найдены элементы формы команды');
                    // Диагностика
                    console.log('Элементы:', {
                        commandIdEdit: !!commandIdEdit,
                        commandNameInput: !!commandNameInput,
                        commandTemplateInput: !!commandTemplateInput,
                        variablesContainer: !!variablesContainer
                    });
                }
            });
        } else {
            console.error('Кнопка добавления команды не найдена');
        }

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
