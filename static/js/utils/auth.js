// Проверка и получение токена
export function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Токен не найден, перенаправление на страницу входа');
        window.location.href = '/login';
    }
    return token;
}

// Функция для выполнения запросов с авторизацией с расширенной отладкой
export async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    
    console.log('Выполнение запроса:', {
        url: url,
        method: options.method || 'GET',
        body: options.body,
        headers: options.headers
    });

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        console.log('Статус ответа:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка запроса:', errorText);
            throw new Error(errorText || 'Произошла ошибка при запросе');
        }

        const data = await response.json();
        console.log('Полученные данные:', data);
        return data;
    } catch (error) {
        console.error('Критическая ошибка:', error);
        throw error;
    }
}
