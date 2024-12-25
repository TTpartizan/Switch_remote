import { loadUsers, createUser, updateUser } from './services/users.js';
import { loadSwitches, createSwitch, updateSwitch } from './services/switches.js';
import { loadCommands, createCommand, updateCommand } from './services/commands.js';
import { getToken } from './utils/auth.js';

// Функция для безопасного получения элемента с расширенной диагностикой
function safeGetElement(selector, context = document) {
    const element = context.querySelector(selector);
    if (!element) {
        console.error(`❌ Элемент с селектором ${selector} не найден`);
        // Выводим все элементы для диагностики
        console.log('Доступные элементы:', 
            Array.from(document.querySelectorAll('*'))
                .filter(el => el.id || el.className)
                .map(el => ({
                    id: el.id, 
                    classes: el.className
                }))
        );
    }
    return element;
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

        // Расширенный поиск и логирование кнопок добавления
        const addButtons = [
            { 
                id: 'addUserBtn', 
                modalId: 'userEditModal',
                resetFields: (form) => {
                    console.log('🔍 Сброс полей формы пользователя');
                    const idEdit = form.querySelector('#userIdEdit');
                    const usernameInput = form.querySelector('#usernameInput');
                    const passwordInput = form.querySelector('#passwordInput');
                    const isAdminCheck = form.querySelector('#isAdminCheck');

                    if (idEdit) idEdit.value = '';
                    if (usernameInput) usernameInput.value = '';
                    if (passwordInput) passwordInput.value = '';
                    if (isAdminCheck) isAdminCheck.checked = false;

                    // Диагностика найденных элементов
                    console.log('Найденные элементы:', {
                        idEdit: !!idEdit,
                        usernameInput: !!usernameInput,
                        passwordInput: !!passwordInput,
                        isAdminCheck: !!isAdminCheck
                    });
                }
            },
            { 
                id: 'addSwitchBtn', 
                modalId: 'switchEditModal',
                resetFields: (form) => {
                    console.log('🔍 Сброс полей формы коммутатора');
                    const idEdit = form.querySelector('#switchIdEdit');
                    const ipInput = form.querySelector('#switchIpInput');
                    const hostnameInput = form.querySelector('#switchHostnameInput');
                    const brandInput = form.querySelector('#switchBrandInput');

                    if (idEdit) idEdit.value = '';
                    if (ipInput) ipInput.value = '';
                    if (hostnameInput) hostnameInput.value = '';
                    if (brandInput) brandInput.value = 'cisco_ios';

                    // Диагностика найденных элементов
                    console.log('Найденные элементы:', {
                        idEdit: !!idEdit,
                        ipInput: !!ipInput,
                        hostnameInput: !!hostnameInput,
                        brandInput: !!brandInput
                    });
                }
            }
        ];

        // Навешиваем обработчики на кнопки добавления
        addButtons.forEach(config => {
            // Расширенный поиск кнопки
            const button = document.getElementById(config.id);
            const modal = document.getElementById(config.modalId);
            const form = modal ? modal.querySelector('form') : null;

            if (button && modal && form) {
                console.log(`✅ Найдена кнопка ${config.id}`);
                button.addEventListener('click', () => {
                    console.log(`🖱️ Нажата кнопка ${config.id}`);
                    
                    // Сброс полей
                    config.resetFields(form);
                    
                    // Показываем модальное окно
                    new bootstrap.Modal(modal).show();
                });
            } else {
                console.error(`❌ Не найдены элементы для ${config.id}:`, {
                    button: !!button,
                    modal: !!modal,
                    form: !!form
                });
            }
        });

    } catch (error) {
        console.error('❌ Критическая ошибка инициализации:', error);
    }
});
