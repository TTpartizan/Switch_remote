from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import database
import schemas
import security

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: schemas.UserCreate):
        existing_user = self.db.query(database.User).filter(database.User.username == user.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Пользователь с таким именем уже существует"
            )
        
        hashed_password = security.get_password_hash(user.password)
        db_user = database.User(
            username=user.username, 
            hashed_password=hashed_password, 
            is_admin=user.is_admin
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return user

    def list_users(self):
        return self.db.query(database.User).all()

    def update_user(self, user_id: int, user: schemas.UserUpdate):
        db_user = self.db.query(database.User).filter(database.User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Пользователь не найден"
            )
        
        if user.username:
            db_user.username = user.username
        if user.password:
            db_user.hashed_password = security.get_password_hash(user.password)
        if user.is_admin is not None:
            db_user.is_admin = user.is_admin
        
        self.db.commit()
        self.db.refresh(db_user)
        return user

    def delete_user(self, user_id: int):
        db_user = self.db.query(database.User).filter(database.User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Пользователь не найден"
            )
        
        self.db.delete(db_user)
        self.db.commit()
        return {"detail": "Пользователь удален"}
