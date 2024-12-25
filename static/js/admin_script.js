import { loadUsers, createUser, updateUser } from './admin/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './admin/switches.js';
import { loadCommands, createCommand, updateCommand } from './admin/commands.js';
import { getToken } from './utils/auth.js';

// Функция для безопасного получения элемента
function safeGetElement(selector, context = document) {
    const element = context.querySelector(selector);
    if (!element) {
        console.warn(`Элемент с селектором ${selector} не найден`);
    }
    return element;
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    
    try {
        getToken(); // Проверка токена

        // Загрузка данных
        loadUsers();
        loadSwitches();
        loadCommands();

        // Обработчики кнопок добавления с расширенной диагностикой
        const addButtons = [
            { 
                selector: '[id$="UserBtn"]', 
                modalSelector: '#userEditModal',
                resetFields: (form) => {
                    form.querySelector('#userIdEdit').value = '';
                    form.querySelector('#usernameInput').value = '';
                    form.querySelector('#passwordInput').value = '';
                    form.querySelector('#isAdminCheck').checked = false;
                }
            },
            { 
                selector: '[id$="SwitchBtn"]', 
                modalSelector: '#switchEditModal',
                resetFields: (form) => {
                    form.querySelector('#switchIdEdit').value = '';
                    form.querySelector('#switchIpInput').value = '';
                    form.querySelector('#switchHostnameInput').value = '';
                    form.querySelector('#switchBrandInput').value = 'cisco_ios';
                }
            },
            { 
                selector: '[id$="CommandBtn"]', 
                modalSelector: '#commandEditModal',
                resetFields: (form) => {
                    form.querySelector('#commandIdEdit').value = '';
                    form.querySelector('#commandNameInput').value = '';
                    form.querySelector('#commandTemplateInput').value = '';
                    
                    // Очистка переменных для команд
                    const variablesContainer = form.querySelector('#variablesContainer');
                    if (variablesContainer) variablesContainer.innerHTML = '';
                }
            }
        ];

        // Навешиваем обработчики на кнопки добавления
        addButtons.forEach(config => {
            const buttons = document.querySelectorAll(config.selector);
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log(`Нажата кнопка: ${button.id}`);
                    
                    const modal = safeGetElement(config.modalSelector);
                    const form = modal ? modal.querySelector('form') : null;
                    
                    if (modal && form) {
                        // Сброс полей
                        config.resetFields(form);
                        
                        // Показываем модальное окно
                        new bootstrap.Modal(modal).show();
                    } else {
                        console.error(`Не найдена форма или модальное окно для ${config.selector}`);
                    }
                });
            });
        });

        // Обработчик добавления переменной для команд
        const addVariableBtn = safeGetElement('#addVariableBtn');
        const variablesContainer = safeGetElement('#variablesContainer');

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

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
