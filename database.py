from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Загрузка переменных окружения
load_dotenv()

# URL базы данных из переменных окружения
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./network_management.db")

# Создание движка базы данных
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Создание фабрики сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для декларативных моделей
Base = declarative_base()

# Модель пользователя
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

# Модель коммутатора
class Switch(Base):
    __tablename__ = "switches"
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True)
    hostname = Column(String)
    brand = Column(String, default="cisco_ios")

# Модель команды с поддержкой переменных
class Command(Base):
    __tablename__ = "commands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    template = Column(String)
    variables = Column(String, nullable=True)  # Храним как JSON-строку

# Создание всех таблиц в базе данных
Base.metadata.create_all(bind=engine)
