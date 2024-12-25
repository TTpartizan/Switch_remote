from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import database
import schemas
import json

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
        
        db_command = database.Command(
            name=command.name, 
            template=command.template,
            variables=json.dumps(command.variables) if command.variables else None
        )
        self.db.add(db_command)
        self.db.commit()
        self.db.refresh(db_command)
        return {
            "id": db_command.id,
            "name": db_command.name,
            "template": db_command.template,
            "variables": command.variables
        }

    def list_commands(self):
        commands = self.db.query(database.Command).all()
        return [
            {
                "id": cmd.id,
                "name": cmd.name,
                "template": cmd.template,
                "variables": json.loads(cmd.variables) if cmd.variables else None
            } for cmd in commands
        ]

    def update_command(self, command_id: int, command: schemas.CommandUpdate):
        db_command = self.db.query(database.Command).filter(database.Command.id == command_id).first()
        if not db_command:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Команда не найдена"
            )
        
        if command.name:
            db_command.name = command.name
        if command.template:
            db_command.template = command.template
        if command.variables is not None:
            db_command.variables = json.dumps(command.variables)
        
        self.db.commit()
        self.db.refresh(db_command)
        return {
            "id": db_command.id,
            "name": db_command.name,
            "template": db_command.template,
            "variables": command.variables
        }

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
