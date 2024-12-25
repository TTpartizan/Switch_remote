from netmiko import ConnectHandler
import os
from dotenv import load_dotenv
import re

# Загружаем переменные окружения
load_dotenv()

def format_connection_error(error_message):
    """
    Форматирование сообщения об ошибке подключения
    """
    # Словарь для перевода и улучшения сообщений
    error_translations = {
        "TCP connection to device failed": "Не удалось установить TCP-соединение с устройством",
        "Authentication failed": "Ошибка аутентификации",
        "Timeout": "Превышено время ожидания соединения"
    }

    # Базовые причины ошибок
    error_reasons = {
        "Incorrect hostname or IP address": "Неверное имя хоста или IP-адрес",
        "Wrong TCP port": "Неправильный TCP-порт",
        "Intermediate firewall blocking access": "Блокировка брандмауэром",
        "Authentication failed": "Неверные учетные данные"
    }

    # Находим основное сообщение об ошибке
    main_error = None
    for key, translation in error_translations.items():
        if key in error_message:
            main_error = translation
            break

    # Находим причины ошибок
    detailed_reasons = []
    for key, reason in error_reasons.items():
        if key in error_message:
            detailed_reasons.append(reason)

    # Извлекаем параметры устройства
    device_match = re.search(r'Device settings: (\w+) ([\d.]+):(\d+)', error_message)
    device_info = None
    if device_match:
        device_type, ip, port = device_match.groups()
        device_info = f"Тип устройства: {device_type}, IP: {ip}, Порт: {port}"

    # Формируем итоговое сообщение
    formatted_message = []
    if main_error:
        formatted_message.append(f"🚨 {main_error}")
    
    if detailed_reasons:
        formatted_message.append("\nВозможные причины:")
        for reason in detailed_reasons:
            formatted_message.append(f"• {reason}")
    
    if device_info:
        formatted_message.append(f"\n{device_info}")

    return {
        "status": "error", 
        "message": "\n".join(formatted_message)
    }

def execute_switch_command(ip_address, command):
    try:
        # Получаем параметры подключения из .env
        device = {
            'device_type': os.getenv('SWITCH_DEVICE_TYPE', 'cisco_ios'),
            'host': ip_address,
            'username': os.getenv('SWITCH_USERNAME'),
            'password': os.getenv('SWITCH_PASSWORD'),
            'port': int(os.getenv('SWITCH_PORT', 22)),
            'timeout': int(os.getenv('SWITCH_TIMEOUT', 10))
        }
        
        with ConnectHandler(**device) as connection:
            output = connection.send_command(command)
            return {"status": "success", "output": output}
    except Exception as e:
        return format_connection_error(str(e))

def test_switch_connection(ip_address):
    """
    Тестовое подключение к коммутатору
    """
    try:
        device = {
            'device_type': os.getenv('SWITCH_DEVICE_TYPE', 'cisco_ios'),
            'host': ip_address,
            'username': os.getenv('SWITCH_USERNAME'),
            'password': os.getenv('SWITCH_PASSWORD'),
            'port': int(os.getenv('SWITCH_PORT', 22)),
            'timeout': int(os.getenv('SWITCH_TIMEOUT', 10))
        }
        
        with ConnectHandler(**device) as connection:
            return {"status": "success", "message": "Успешное подключение"}
    except Exception as e:
        return format_connection_error(str(e))
