import { fetchWithAuth } from '../utils/auth.js';

export async function loadSwitches() {
    try {
        console.log('Начало загрузки коммутаторов');
        const switches = await fetchWithAuth('/admin/switches/');
        
        console.log('Количество коммутаторов:', switches.length);
        
        const tbody = document.getElementById('switchesTableBody');
        if (!tbody) {
            console.error('Элемент switchesTableBody не найден');
            return;
        }
        
        tbody.innerHTML = '';
        switches.forEach(sw => {
            const row = `
                <tr>
                    <td>${sw.id}</td>
                    <td>${sw.ip_address}</td>
                    <td>${sw.hostname}</td>
                    <td>${sw.brand}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-switch" data-id="${sw.id}">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-switch" data-id="${sw.id}">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        console.log('Коммутаторы загружены и отображены');
    } catch (error) {
        console.error('Критическая ошибка загрузки коммутаторов:', error);
        alert(`Ошибка загрузки коммутаторов: ${error.message}`);
    }
}

export async function createSwitch(switchData) {
    try {
        await fetchWithAuth('/admin/switches/', {
            method: 'POST',
            body: JSON.stringify(switchData)
        });
        alert('Коммутатор успешно создан');
        loadSwitches();
    } catch (error) {
        console.error('Ошибка создания коммутатора:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

export async function updateSwitch(switchId, switchData) {
    try {
        await fetchWithAuth(`/admin/switches/${switchId}`, {
            method: 'PUT',
            body: JSON.stringify(switchData)
        });
        alert('Коммутатор успешно обновлен');
        loadSwitches();
    } catch (error) {
        console.error('Ошибка обновления коммутатора:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

export async function deleteSwitch(switchId) {
    try {
        await fetchWithAuth(`/admin/switches/${switchId}`, {
            method: 'DELETE'
        });
        alert('Коммутатор успешно удален');
        loadSwitches();
    } catch (error) {
        console.error('Ошибка удаления коммутатора:', error);
        alert(`Ошибка: ${error.message}`);
    }
}
