import { loadUsers, createUser, updateUser } from './services/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './services/switches.js';
import { loadCommands, createCommand, updateCommand } from './services/commands.js';
import { getToken } from './utils/auth.js';

// Функция для безопасного получения элемента
function safeGetElement(selector, context = document) {
    const element = context.querySelector(selector);
    if (!element) {
        console.warn(`Элемент с селектором ${selector} не найден`);
    }
    return element;
}

// Функция для сбора данных из формы
function collectFormData(form) {
    const formData = {};
    
    // Собираем все input элементы
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

    console.log('Собранные данные формы:', formData);
    return formData;
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
                    console.log(`Отправка формы: ${formConfig.selector}`);

                    try {
                        const formData = collectFormData(form);
                        const idInput = form.querySelector('[id$="IdEdit"]');
                        const id = idInput ? idInput.value : null;

                        console.log('ID:', id);
                        console.log('Данные:', formData);

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
                        console.error('Ошибка при отправке формы:', error);
                        alert(`Ошибка: ${error.message}`);
                    }
                });
            } else {
                console.error(`Форма ${formConfig.selector} не найдена`);
            }
        });

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
