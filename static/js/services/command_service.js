import { fetchWithAuth } from '../utils/auth.js';

export async function loadCommands() {
    try {
        console.log('Начало загрузки команд');
        const commands = await fetchWithAuth('/admin/commands/');
        
        console.log('Количество команд:', commands.length);
        
        const tbody = document.getElementById('commandsTableBody');
        if (!tbody) {
            console.error('Элемент commandsTableBody не найден');
            return;
        }
        
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

        console.log('Команды загружены и отображены');
    } catch (error) {
        console.error('Критическая ошибка загрузки команд:', error);
        alert(`Ошибка загрузки команд: ${error.message}`);
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
