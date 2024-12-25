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
                <tr data-id="${sw.id}">
                    <td>${sw.id}</td>
                    <td>${sw.ip_address}</td>
                    <td>${sw.hostname}</td>
                    <td>${sw.brand}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-switch">Изменить</button>
                        <button class="btn btn-sm btn-danger delete-switch">Удалить</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Навешиваем обработчики редактирования
        tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-switch')) {
                const row = e.target.closest('tr');
                const switchId = row.dataset.id;
                
                const ipInput = document.getElementById('switchIpInput');
                const hostnameInput = document.getElementById('switchHostnameInput');
                const brandInput = document.getElementById('switchBrandInput');
                const switchIdEdit = document.getElementById('switchIdEdit');

                if (ipInput && hostnameInput && brandInput && switchIdEdit) {
                    switchIdEdit.value = switchId;
                    ipInput.value = row.querySelector('td:nth-child(2)').textContent;
                    hostnameInput.value = row.querySelector('td:nth-child(3)').textContent;
                    brandInput.value = row.querySelector('td:nth-child(4)').textContent;
                    
                    new bootstrap.Modal(document.getElementById('switchEditModal')).show();
                } else {
                    console.error('Не найдены элементы формы редактирования коммутатора');
                }
            }
        });

        // Навешиваем обработчики удаления
        tbody.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-switch')) {
                const row = e.target.closest('tr');
                const switchId = row.dataset.id;
                
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
            }
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
