import { loadUsers } from './services/user_service.js';
import { loadSwitches } from './services/switch_service.js';
import { loadCommands, createCommand, updateCommand } from './services/command_service.js';
import { getToken } from './utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    
    try {
        getToken();
        loadUsers();
        loadSwitches();
        loadCommands();

        // Добавление переменной для команды
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

        // Обработчики редактирования команд
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-command')) {
                const commandId = e.target.dataset.id;
                const commandRow = e.target.closest('tr');
                
                // Очистка существующих переменных
                const variablesContainer = document.getElementById('variablesContainer');
                variablesContainer.innerHTML = '';

                document.getElementById('commandIdEdit').value = commandId;
                document.getElementById('commandNameInput').value = commandRow.querySelector('td:nth-child(2)').textContent;
                document.getElementById('commandTemplateInput').value = commandRow.querySelector('td:nth-child(3)').textContent;
                
                new bootstrap.Modal(document.getElementById('commandEditModal')).show();
            }
        });

        // Обработчик формы команд с поддержкой переменных
        const commandForm = document.getElementById('commandForm');
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
