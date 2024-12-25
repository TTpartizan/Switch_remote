import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from database import User, Switch, Command
from security import get_password_hash

def init_database():
    # Создаем все таблицы
    Base.metadata.create_all(bind=engine)

    # Создаем сессию
    db = SessionLocal()

    try:
        # Проверяем, не инициализирована ли база уже
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("База данных уже инициализирована")
            return

        # Создаем администратора
        admin = User(
            username="admin",
            hashed_password=get_password_hash("admin_password"),
            is_admin=True
        )
        db.add(admin)

        # Создаем обычного пользователя
        user = User(
            username="user",
            hashed_password=get_password_hash("user_password"),
            is_admin=False
        )
        db.add(user)

        # Добавляем тестовые коммутаторы
        switches = [
            Switch(
                ip_address="172.17.21.25", 
                hostname="SNR-Switch-1", 
                brand="SNR"
            ),
            Switch(
                ip_address="172.17.21.23", 
                hostname="SNR-Switch-2", 
                brand="SNR"
            )
        ]
        
        # Используем db.add_all() вместо extend
        db.add_all(switches)

        # Добавляем тестовые команды
        commands = [
            Command(
                name="Версия устройства", 
                template="show ver"
            ),
            Command(
                name="Тест виртуального кабеля (порт)", 
                template="virtual-cable-test interface ethernet 1/0/х"
            )
        ]
        
        # Используем db.add_all() вместо extend
        db.add_all(commands)

        # Сохраняем изменения
        db.commit()
        print("База данных успешно инициализирована тестовыми данными")

    except Exception as e:
        db.rollback()
        print(f"Ошибка при инициализации базы данных: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    init_database()
