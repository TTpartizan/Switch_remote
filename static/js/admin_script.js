import { loadUsers, createUser, updateUser } from './admin/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './admin/switches.js';
import { loadCommands, createCommand, updateCommand } from './admin/commands.js';
import { getToken } from './utils/auth.js';

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    
    try {
        getToken(); // Проверка токена

        // Принудительная первичная загрузка данных
        console.log('Принудительная первичная загрузка данных');
        
        // Проверяем наличие модальных окон
        const userModal = document.getElementById('userModal');
        const switchModal = document.getElementById('switchModal');
        const commandModal = document.getElementById('commandModal');

        console.log('Статус модальных окон:', {
            userModal: !!userModal,
            switchModal: !!switchModal,
            commandModal: !!commandModal
        });

        // Загрузка данных независимо от модальных окон
        loadUsers();
        loadSwitches();
        loadCommands();

        // Обработчики для кнопок добавления
        const addUserBtn = document.getElementById('addUserBtn');
        const addSwitchBtn = document.getElementById('addSwitchBtn');
        const addCommandBtn = document.getElementById('addCommandBtn');

        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                document.getElementById('userIdEdit').value = '';
                document.getElementById('usernameInput').value = '';
                document.getElementById('passwordInput').value = '';
                document.getElementById('isAdminCheck').checked = false;
                new bootstrap.Modal(document.getElementById('userEditModal')).show();
            });
        }

        if (addSwitchBtn) {
            addSwitchBtn.addEventListener('click', () => {
                document.getElementById('switchIdEdit').value = '';
                document.getElementById('switchIpInput').value = '';
                document.getElementById('switchHostnameInput').value = '';
                document.getElementById('switchBrandInput').value = 'cisco_ios';
                new bootstrap.Modal(document.getElementById('switchEditModal')).show();
            });
        }

        if (addCommandBtn) {
            addCommandBtn.addEventListener('click', () => {
                document.getElementById('commandIdEdit').value = '';
                document.getElementById('commandNameInput').value = '';
                document.getElementById('commandTemplateInput').value = '';
                
                // Очистка существующих переменных
                const variablesContainer = document.getElementById('variablesContainer');
                variablesContainer.innerHTML = '';

                new bootstrap.Modal(document.getElementById('commandEditModal')).show();
            });
        }

        // Обработчик добавления переменной для команд
        const addVariableBtn = document.getElementById('addVariableBtn');
        const variablesContainer = document.getElementById('variablesContainer');

        if (addVariableBtn && variablesContainer) {
            addVariableBtn.addEventListener('click', () => {
                const variableRow = document.createElement('div');
                variableRow.classList.add('input-group', 'mb-2');
                variableRow.innerHTML = `
                    <input type="text" class="form-control variable-name" placeholder="Имя переменной">
                    <input type="text" class="form-control variable-value" placeholder="Значение">
                    <button type="button" class="btn btn-danger remove-variable">Удалить</button>
                `;
                variablesContainer.appendChild(variableRow);

                // Обработчик удаления переменной
                variableRow.querySelector('.remove-variable').addEventListener('click', () => {
                    variablesContainer.removeChild(variableRow);
                });
            });
        }

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
                } else {
                    await createUser(userData);
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
                } else {
                    await createSwitch(switchData);
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

                // Сбор переменных
                const variables = {};
                document.querySelectorAll('#variablesContainer .input-group').forEach(group => {
                    const nameInput = group.querySelector('.variable-name');
                    const valueInput = group.querySelector('.variable-value');
                    
                    if (nameInput.value && valueInput.value) {
                        variables[nameInput.value] = valueInput.value;
                    }
                });

                const commandData = { 
                    name, 
                    template, 
                    variables: Object.keys(variables).length ? variables : null 
                };
                
                if (commandId) {
                    await updateCommand(commandId, commandData);
                } else {
                    await createCommand(commandData);
                }

                bootstrap.Modal.getInstance(document.getElementById('commandEditModal')).hide();
            });
        }

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
