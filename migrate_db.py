import os
import sqlite3
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

# Получаем путь к базе данных
DATABASE_PATH = "./network_management.db"

def migrate_database():
    try:
        # Подключение к базе данных
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        # Проверяем существование столбца variables
        cursor.execute("PRAGMA table_info(commands)")
        columns = cursor.fetchall()
        
        # Флаг наличия столбца variables
        variables_column_exists = any(column[1] == 'variables' for column in columns)

        if not variables_column_exists:
            print("Добавление столбца variables в таблицу commands...")
            
            # Создаем резервную копию таблицы
            cursor.execute("""
                CREATE TABLE commands_backup (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    template TEXT
                )
            """)
            
            # Копируем существующие данные
            cursor.execute("""
                INSERT INTO commands_backup (id, name, template)
                SELECT id, name, template FROM commands
            """)
            
            # Удаляем старую таблицу
            cursor.execute("DROP TABLE commands")
            
            # Создаем новую таблицу с новым столбцом
            cursor.execute("""
                CREATE TABLE commands (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    template TEXT,
                    variables TEXT
                )
            """)
            
            # Восстанавливаем данные
            cursor.execute("""
                INSERT INTO commands (id, name, template)
                SELECT id, name, template FROM commands_backup
            """)
            
            # Удаляем резервную таблицу
            cursor.execute("DROP TABLE commands_backup")
            
            conn.commit()
            print("Миграция базы данных завершена успешно.")
        else:
            print("Столбец variables уже существует.")

    except sqlite3.Error as e:
        print(f"Ошибка при миграции базы данных: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
