from netmiko import ConnectHandler
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

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
        return {"status": "error", "message": str(e)}

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
        return {"status": "error", "message": str(e)}
