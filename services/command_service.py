from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import database
import schemas

class CommandService:
    def __init__(self, db: Session):
        self.db = db

    def create_command(self, command: schemas.CommandCreate):
        existing_command = self.db.query(database.Command).filter(database.Command.name == command.name).first()
        if existing_command:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Команда с таким именем уже существует"
            )
        
        db_command = database.Command(**command.dict())
        self.db.add(db_command)
        self.db.commit()
        self.db.refresh(db_command)
        return command

    def list_commands(self):
        return self.db.query(database.Command).all()

    def update_command(self, command_id: int, command: schemas.CommandUpdate):
        db_command = self.db.query(database.Command).filter(database.Command.id == command_id).first()
        if not db_command:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Команда не найдена"
            )
        
        for key, value in command.dict(exclude_unset=True).items():
            setattr(db_command, key, value)
        
        self.db.commit()
        self.db.refresh(db_command)
        return command

    def delete_command(self, command_id: int):
        db_command = self.db.query(database.Command).filter(database.Command.id == command_id).first()
        if not db_command:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Команда не найдена"
            )
        
        self.db.delete(db_command)
        self.db.commit()
        return {"detail": "Команда удалена"}
