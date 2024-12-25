import { fetchWithAuth } from '../utils/auth.js';

export async function loadCommands() {
    try {
        const commands = await fetchWithAuth('/admin/commands/');
        const tbody = document.getElementById('commandsTableBody');
        tbody.innerHTML = '';
        commands.forEach(cmd => {
            const row = `
                <tr>
                    <td>${cmd.id}</td>
                    <td>${cmd.name}</td>
                    <td>${cmd.template}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-command" data-id="${cmd.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-command" data-id="${cmd.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Навешиваем обработчики после загрузки
        document.querySelectorAll('.edit-command').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandId = e.target.dataset.id;
                const cmd = commands.find(c => c.id === parseInt(commandId));
                
                if (cmd) {
                    document.getElementById('commandIdEdit').value = cmd.id;
                    document.getElementById('commandNameInput').value = cmd.name;
                    document.getElementById('commandTemplateInput').value = cmd.template;
                    
                    new bootstrap.Modal(document.getElementById('commandEditModal')).show();
                }
            });
        });

        // Навешиваем обработчики удаления
        document.querySelectorAll('.delete-command').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandId = e.target.dataset.id;
                if (confirm('Вы уверены, что хотите удалить эту команду?')) {
                    deleteCommand(commandId);
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

export async function deleteCommand(commandId) {
    try {
        await fetchWithAuth(`/admin/commands/${commandId}`, {
            method: 'DELETE'
        });
        alert('Команда успешно удалена');
        loadCommands();
    } catch (error) {
        console.error('Ошибка удаления команды:', error);
        alert(`Ошибка: ${error.message}`);
    }
}
