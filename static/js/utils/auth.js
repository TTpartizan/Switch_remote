// Проверка и получение токена
export function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
    }
    return token;
}

// Функция для выполнения запросов с авторизацией
export async function fetchWithAuth(url, options = {}) {
    console.log('Запрос:', url, options);
    const token = getToken();
    
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

        console.log('Ответ:', response);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Ошибка:', errorData);
            throw new Error(errorData || 'Произошла ошибка');
        }

        return response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
}
