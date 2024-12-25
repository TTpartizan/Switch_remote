from fastapi import HTTPException, status
from database import User

def check_admin_permission(current_user: User):
    if not current_user or not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Недостаточно прав доступа"
        )
