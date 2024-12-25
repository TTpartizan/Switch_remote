import { fetchWithAuth } from '../utils/auth.js';

export async function loadSwitches() {
    try {
        const switches = await fetchWithAuth('/admin/switches/');
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

        // Навешиваем обработчики редактирования
        document.querySelectorAll('.edit-switch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const switchId = e.target.dataset.id;
                const switchRow = e.target.closest('tr');
                
                document.getElementById('switchIdEdit').value = switchId;
                document.getElementById('switchIpInput').value = switchRow.querySelector('td:nth-child(2)').textContent;
                document.getElementById('switchHostnameInput').value = switchRow.querySelector('td:nth-child(3)').textContent;
                document.getElementById('switchBrandInput').value = switchRow.querySelector('td:nth-child(4)').textContent;
                
                new bootstrap.Modal(document.getElementById('switchEditModal')).show();
            });
        });

        // Навешиваем обработчики удаления
        document.querySelectorAll('.delete-switch').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const switchId = e.target.dataset.id;
                if (confirm('Вы уверены, что хотите удалить этот коммутатор?')) {
                    try {
                        await fetchWithAuth(`/admin/switches/${switchId}`, { method: 'DELETE' });
                        alert('Коммутатор успешно удален');
                        loadSwitches();
                    } catch (error) {
                        console.error('Ошибка удаления коммутатора:', error);
                        alert(`Ошибка: ${error.message}`);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Ошибка загрузки коммутаторов:', error);
        alert(error.message);
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
