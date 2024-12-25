from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import database
import security

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def check_admin_permission(current_user: database.User):
    if not current_user or not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Недостаточно прав доступа"
        )

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = security.jwt.decode(
            token, 
            security.os.getenv("SECRET_KEY"), 
            algorithms=[security.os.getenv("ALGORITHM")]
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except security.jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    user = db.query(database.User).filter(database.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user

def get_current_active_user(current_user: database.User = Depends(get_current_user)):
    return current_user
