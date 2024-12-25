from netmiko import ConnectHandler
import os

def execute_switch_command(ip_address, command):
    try:
        device = {
            'device_type': 'snr',
            'host': ip_address,
            'username': os.getenv('SWITCH_USERNAME'),
            'password': os.getenv('SWITCH_PASSWORD')
        }
        
        with ConnectHandler(**device) as connection:
            output = connection.send_command(command)
            return {"status": "success", "output": output}
    except Exception as e:
        return {"status": "error", "message": str(e)}
