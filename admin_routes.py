from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database
import schemas
import security

admin_router = APIRouter(prefix="/admin", tags=["admin"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_admin_permission(current_user: database.User):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

# Пользователи, коммутаторы, команды - те же CRUD-операции, что были в предыдущем ответе
