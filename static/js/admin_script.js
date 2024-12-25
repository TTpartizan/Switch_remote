import { loadUsers, createUser, updateUser } from './services/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './services/switches.js';
import { loadCommands, createCommand, updateCommand } from './services/commands.js';
import { getToken } from './utils/auth.js';

// Функция для сбора данных из формы с расширенной диагностикой
function collectFormData(form) {
    console.log('🔍 Сбор данных из формы:', form.id);
    const rawData = {};
    
    // Собираем все input элементы
    form.querySelectorAll('input').forEach(input => {
        console.log(`Элемент: ${input.id}, Тип: ${input.type}, Значение: ${input.value}`);
        
        if (input.type === 'hidden') {
            rawData[input.id.replace('Edit', '')] = input.value;
        } else if (input.type === 'text') {
            rawData[input.id.replace('Input', '')] = input.value;
        } else if (input.type === 'password') {
            if (input.value) {
                rawData[input.id.replace('Input', '')] = input.value;
            }
        } else if (input.type === 'checkbox') {
            rawData[input.id.replace('Check', '')] = input.checked;
        }
    });

    // Маппинг ключей для разных форм
    const keyMappings = {
        'switch': {
            'switchId': 'id',
            'switchIp': 'ip_address',
            'switchHostname': 'hostname',
            'switchBrand': 'brand'
        },
        'user': {
            'userId': 'id',
            'username': 'username',
            'password': 'password',
            'isAdmin': 'is_admin'
        },
        'command': {
            'commandId': 'id',
            'commandName': 'name',
            'commandTemplate': 'template'
        }
    };

    // Определяем тип формы
    let formType = '';
    if (form.id.includes('switchForm')) formType = 'switch';
    else if (form.id.includes('userForm')) formType = 'user';
    else if (form.id.includes('commandForm')) formType = 'command';

    console.log('Тип формы:', formType);

    // Преобразуем ключи
    const mappedData = {};
    const mapping = keyMappings[formType] || {};
    
    Object.keys(rawData).forEach(key => {
        const mappedKey = mapping[key] || key;
        mappedData[mappedKey] = rawData[key];
        console.log(`Преобразование: ${key} -> ${mappedKey}, Значение: ${rawData[key]}`);
    });

    // Специфичная логика для команд (сбор переменных)
    if (formType === 'command') {
        const variables = {};
        document.querySelectorAll('#variablesContainer .input-group').forEach(group => {
            const nameInput = group.querySelector('.variable-name');
            const valueInput = group.querySelector('.variable-value');
            
            if (nameInput.value && valueInput.value) {
                variables[nameInput.value] = valueInput.value;
            }
        });
        mappedData.variables = Object.keys(variables).length ? variables : null;
    }

    console.log('✅ Финальные данные:', mappedData);
    return mappedData;
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM загружен, навешиваем обработчики');
    
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
                loadFunc: loadUsers,
                name: 'Пользователи'
            },
            { 
                selector: '#switchForm', 
                createFunc: createSwitch, 
                updateFunc: updateSwitch,
                loadFunc: loadSwitches,
                name: 'Коммутаторы'
            },
            { 
                selector: '#commandForm', 
                createFunc: createCommand, 
                updateFunc: updateCommand,
                loadFunc: loadCommands,
                name: 'Команды'
            }
        ];

        forms.forEach(formConfig => {
            const form = document.querySelector(formConfig.selector);
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    console.log(`🖊️ Отправка формы: ${formConfig.name}`);

                    try {
                        const formData = collectFormData(form);
                        const idInput = form.querySelector('[id$="IdEdit"]');
                        const id = idInput ? idInput.value : null;

                        console.log(`🆔 ID: ${id}`);
                        console.log('📦 Данные:', formData);

                        if (id) {
                            console.log(`🔄 Обновление ${formConfig.name}`);
                            await formConfig.updateFunc(id, formData);
                        } else {
                            console.log(`➕ Создание ${formConfig.name}`);
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
                        console.error(`❌ Ошибка при работе с ${formConfig.name}:`, error);
                        alert(`Ошибка: ${error.message}`);
                    }
                });
            } else {
                console.error(`❌ Форма ${formConfig.selector} не найдена`);
            }
        });

    } catch (error) {
        console.error('❌ Критическая ошибка инициализации:', error);
    }
});
