import { loadUsers } from './services/user_service.js';
import { loadSwitches } from './services/switch_service.js';
import { loadCommands } from './services/command_service.js';
import { getToken } from './utils/auth.js';

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, навешиваем обработчики');
    
    try {
        getToken(); // Проверка токена

        // Принудительная первичная загрузка данных
        console.log('Принудительная первичная загрузка данных');
        
        // Проверяем наличие модальных окон
        const userModal = document.getElementById('userModal');
        const switchModal = document.getElementById('switchModal');
        const commandModal = document.getElementById('commandModal');

        console.log('Статус модальных окон:', {
            userModal: !!userModal,
            switchModal: !!switchModal,
            commandModal: !!commandModal
        });

        // Загрузка данных независимо от модальных окон
        loadUsers();
        loadSwitches();
        loadCommands();

        // Навешиваем обработчики на модальные окна, если они существуют
        if (userModal) {
            userModal.addEventListener('show.bs.modal', () => {
                console.log('Открытие модального окна пользователей');
                loadUsers();
            });
        }

        if (switchModal) {
            switchModal.addEventListener('show.bs.modal', () => {
                console.log('Открытие модального окна коммутаторов');
                loadSwitches();
            });
        }

        if (commandModal) {
            commandModal.addEventListener('show.bs.modal', () => {
                console.log('Открытие модального окна команд');
                loadCommands();
            });
        }

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }
});
