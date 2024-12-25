from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from dependencies.db import get_db
from dependencies.auth import check_admin_permission, get_current_active_user
from services.user_service import UserService
from services.switch_service import SwitchService
from services.command_service import CommandService
from services.network_service import NetworkService

import database
import schemas

admin_router = APIRouter(prefix="/admin", tags=["admin"])

# Пользователи
@admin_router.get("/users/", response_model=List[Dict])
def list_users(
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return UserService(db).list_users()

@admin_router.post("/users/", response_model=Dict)
def create_user(
    user: schemas.UserCreate, 
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return UserService(db).create_user(user)

@admin_router.put("/users/{user_id}", response_model=Dict)
def update_user(
    user_id: int, 
    user: schemas.UserUpdate,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return UserService(db).update_user(user_id, user)

@admin_router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return UserService(db).delete_user(user_id)

# Коммутаторы
@admin_router.get("/switches/", response_model=List[Dict])
def list_switches(
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return SwitchService(db).list_switches()

@admin_router.post("/switches/", response_model=Dict)
def create_switch(
    switch: schemas.SwitchCreate,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return SwitchService(db).create_switch(switch)

@admin_router.put("/switches/{switch_id}", response_model=Dict)
def update_switch(
    switch_id: int, 
    switch: schemas.SwitchUpdate,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return SwitchService(db).update_switch(switch_id, switch)

@admin_router.delete("/switches/{switch_id}")
def delete_switch(
    switch_id: int,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return SwitchService(db).delete_switch(switch_id)

# Команды
@admin_router.get("/commands/", response_model=List[Dict])
def list_commands(
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return CommandService(db).list_commands()

@admin_router.post("/commands/", response_model=Dict)
def create_command(
    command: schemas.CommandCreate,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return CommandService(db).create_command(command)

@admin_router.put("/commands/{command_id}", response_model=Dict)
def update_command(
    command_id: int, 
    command: schemas.CommandUpdate,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return CommandService(db).update_command(command_id, command)

@admin_router.delete("/commands/{command_id}")
def delete_command(
    command_id: int,
    current_user: database.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_admin_permission(current_user)
    return CommandService(db).delete_command(command_id)

# Тестирование подключения к коммутатору
@admin_router.post("/test-switch-connection")
def test_switch_connection(
    switch_ip: str,
    current_user: database.User = Depends(get_current_active_user)
):
    check_admin_permission(current_user)
    return NetworkService.test_switch_connection(switch_ip)
