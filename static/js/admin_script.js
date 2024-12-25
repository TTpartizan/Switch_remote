import { loadUsers, createUser, updateUser } from './admin/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './admin/switches.js';
import { loadCommands, createCommand, updateCommand } from './admin/commands.js';
import { getToken } from './utils/auth.js';

// Функция для безопасного получения элемента
function safeGetElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Элемент с селектором ${selector} не найден`);
    }
    return element;
}

// Функция для создания модального окна
function createModal(modalSelector, formSelector, loadFunction, createFunction, updateFunction) {
    const modal = safeGetElement(modalSelector);
    const form = safeGetElement(formSelector);

    if (!modal || !form) return;

    const addButton = modal.querySelector('[id$="Btn"]');
    if (addButton) {
        addButton.addEventListener('click', () => {
            // Сбрасываем все поля ввода внутри формы
            form.querySelectorAll('input').forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'hidden') {
                    input.value = '';
                } else {
                    input.value = input.dataset.default || '';
                }
            });

            // Специфичные действия для команд (очистка переменных)
            if (modalSelector === '#commandModal') {
                const variablesContainer = safeGetElement('#variablesContainer');
                if (variablesContainer) variablesContainer.innerHTML = '';
            }

            new bootstrap.Modal(modal).show();
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const idInput = form.querySelector('[id$="IdEdit"]');
        const id = idInput ? idInput.value : null;

        // Собираем данные из формы
        const formData = {};
        form.querySelectorAll('input:not([type="submit"])').forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id.replace('Input', '')] = input.checked;
            } else if (input.value) {
                formData[input.id.replace('Input', '')] = input.value;
            }
        });

        // Специфичные действия для команд (сбор переменных)
        if (modalSelector === '#commandModal') {
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
            if (id) {
                await updateFunction(id, formData);
            } else {
                await createFunction(formData);
            }

            bootstrap.Modal.getInstance(modal).hide();
            loadFunction();
        } catch (error) {
            console.error('Ошибка:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });
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

        // Создание модальных окон
        createModal('#userModal', '#userForm', loadUsers, createUser, updateUser);
        createModal('#switchModal', '#switchForm', loadSwitches, createSwitch, updateSwitch);
        createModal('#commandModal', '#commandForm', loadCommands, createCommand, updateCommand);

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
