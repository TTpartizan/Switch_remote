import network_utils
from fastapi import HTTPException, status

class NetworkService:
    @staticmethod
    def test_switch_connection(switch_ip: str):
        result = network_utils.test_switch_connection(switch_ip)
        if result['status'] == 'error':
            raise HTTPException(status_code=400, detail=result['message'])
        return result
