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
                }
            });
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
                }
            });
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
                }
            });
        }

        // Обработчики форм
        const forms = [
            { 
                selector: '#userForm', 
                createFunc: createUser, 
                updateFunc: updateUser,
                loadFunc: loadUsers 
            },
            { 
                selector: '#switchForm', 
                createFunc: createSwitch, 
                updateFunc: updateSwitch,
                loadFunc: loadSwitches 
            },
            { 
                selector: '#commandForm', 
                createFunc: createCommand, 
                updateFunc: updateCommand,
                loadFunc: loadCommands 
            }
        ];

        forms.forEach(formConfig => {
            const form = document.querySelector(formConfig.selector);
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const formData = {};
                    form.querySelectorAll('input').forEach(input => {
                        if (input.type === 'hidden') {
                            formData[input.id.replace('Edit', '')] = input.value;
                        } else if (input.type === 'text') {
                            formData[input.id.replace('Input', '')] = input.value;
                        } else if (input.type === 'password') {
                            if (input.value) {
                                formData[input.id.replace('Input', '')] = input.value;
                            }
                        } else if (input.type === 'checkbox') {
                            formData[input.id.replace('Check', '')] = input.checked;
                        }
                    });

                    // Специфичная логика для команд (сбор переменных)
                    if (form.id === 'commandForm') {
                        const variables = {};
                        document.querySelectorAll('#variablesContainer .input-group').forEach(group => {
                            const nameInput = group.querySelector('.variable-name');
                            const valueInput = group.querySelector('.variable-value');
                            
                            if (nameInput.value && valueInput.value) {
                                variables[nameInput.value] = valueInput.value;
                            }
                        });
                        formData.variables = Object.keys(variables).length ? variables : null;
                    }

                    try {
                        const idInput = form.querySelector('[id$="IdEdit"]');
                        const id = idInput ? idInput.value : null;

                        if (id) {
                            await formConfig.updateFunc(id, formData);
                        } else {
                            await formConfig.createFunc(formData);
                        }

                        // Закрываем модальное окно
                        const modalElement = form.closest('.modal');
                        if (modalElement) {
                            bootstrap.Modal.getInstance(modalElement).hide();
                        }

                        // Перезагружаем данные
                        formConfig.loadFunc();
                    } catch (error) {
                        console.error('Ошибка при работе с формой:', error);
                        alert(`Ошибка: ${error.message}`);
                    }
                });
            }
        });

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
