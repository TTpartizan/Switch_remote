import { fetchWithAuth } from '../utils/auth.js';

export async function loadCommands() {
    try {
        const commands = await fetchWithAuth('/admin/commands/');
        const tbody = document.getElementById('commandsTableBody');
        
        if (!tbody) {
            console.error('Элемент commandsTableBody не найден');
            return;
        }
        
        tbody.innerHTML = '';
        commands.forEach(cmd => {
            const variables = cmd.variables ? 
                Object.entries(cmd.variables).map(([key, value]) => `${key}: ${value}`).join(', ') 
                : 'Нет';
            
            const row = `
                <tr data-id="${cmd.id}">
                    <td>${cmd.id}</td>
                    <td>${cmd.name}</td>
                    <td>${cmd.template}</td>
                    <td>${variables}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-command">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-command">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Навешиваем обработчики редактирования
        tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-command')) {
                const row = e.target.closest('tr');
                const commandId = row.dataset.id;
                
                const nameInput = document.getElementById('commandNameInput');
                const templateInput = document.getElementById('commandTemplateInput');
                const commandIdEdit = document.getElementById('commandIdEdit');
                const variablesContainer = document.getElementById('variablesContainer');

                if (nameInput && templateInput && commandIdEdit && variablesContainer) {
                    // Очистка существующих переменных
                    variablesContainer.innerHTML = '';

                    commandIdEdit.value = commandId;
                    nameInput.value = row.querySelector('td:nth-child(2)').textContent;
                    templateInput.value = row.querySelector('td:nth-child(3)').textContent;
                    
                    // Добавление существующих переменных
                    const variablesText = row.querySelector('td:nth-child(4)').textContent;
                    if (variablesText !== 'Нет') {
                        variablesText.split(', ').forEach(variable => {
                            const [name, value] = variable.split(': ');
                            const variableRow = document.createElement('div');
                            variableRow.classList.add('input-group', 'mb-2');
                            variableRow.innerHTML = `
                                <input type="text" class="form-control variable-name" value="${name}" placeholder="Имя переменной">
                                <input type="text" class="form-control variable-value" value="${value}" placeholder="Значение">
                                <button type="button" class="btn btn-danger remove-variable">Удалить</button>
                            `;
                            variablesContainer.appendChild(variableRow);

                            // Обработчик удаления переменной
                            variableRow.querySelector('.remove-variable').addEventListener('click', () => {
                                variablesContainer.removeChild(variableRow);
                            });
                        });
                    }
                    
                    new bootstrap.Modal(document.getElementById('commandEditModal')).show();
                } else {
                    console.error('Не найдены элементы формы редактирования команды');
                }
            }
        });

        // Навешиваем обработчики удаления
        tbody.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-command')) {
                const row = e.target.closest('tr');
                const commandId = row.dataset.id;
                
                if (confirm('Вы уверены, что хотите удалить эту команду?')) {
                    try {
                        await fetchWithAuth(`/admin/commands/${commandId}`, { method: 'DELETE' });
                        alert('Команда успешно удалена');
                        loadCommands();
                    } catch (error) {
                        console.error('Ошибка удаления команды:', error);
                        alert(`Ошибка: ${error.message}`);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки команд:', error);
        alert(error.message);
    }
}

export async function createCommand(commandData) {
    try {
        await fetchWithAuth('/admin/commands/', {
            method: 'POST',
            body: JSON.stringify(commandData)
        });
        alert('Команда успешно создана');
        loadCommands();
    } catch (error) {
        console.error('Ошибка создания команды:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

export async function updateCommand(commandId, commandData) {
    try {
        await fetchWithAuth(`/admin/commands/${commandId}`, {
            method: 'PUT',
            body: JSON.stringify(commandData)
        });
        alert('Команда успешно обновлена');
        loadCommands();
    } catch (error) {
        console.error('Ошибка обновления команды:', error);
        alert(`Ошибка: ${error.message}`);
    }
}
