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
                <tr>
                    <td>${cmd.id}</td>
                    <td>${cmd.name}</td>
                    <td>${cmd.template}</td>
                    <td>${variables}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-command" data-id="${cmd.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-command" data-id="${cmd.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Навешиваем обработчики редактирования
        document.querySelectorAll('.edit-command').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandId = e.target.dataset.id;
                const commandRow = e.target.closest('tr');
                
                // Очистка существующих переменных
                const variablesContainer = document.getElementById('variablesContainer');
                variablesContainer.innerHTML = '';

                document.getElementById('commandIdEdit').value = commandId;
                document.getElementById('commandNameInput').value = commandRow.querySelector('td:nth-child(2)').textContent;
                document.getElementById('commandTemplateInput').value = commandRow.querySelector('td:nth-child(3)').textContent;
                
                // Добавление существующих переменных
                const variablesText = commandRow.querySelector('td:nth-child(4)').textContent;
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
            });
        });

        // Навешиваем обработчики удаления
        document.querySelectorAll('.delete-command').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const commandId = e.target.dataset.id;
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
            });
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
