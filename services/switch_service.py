from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import database
import schemas

class SwitchService:
    def __init__(self, db: Session):
        self.db = db

    def create_switch(self, switch: schemas.SwitchCreate):
        existing_switch = self.db.query(database.Switch).filter(database.Switch.ip_address == switch.ip_address).first()
        if existing_switch:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Коммутатор с таким IP уже существует"
            )
        
        db_switch = database.Switch(**switch.dict())
        self.db.add(db_switch)
        self.db.commit()
        self.db.refresh(db_switch)
        return {
            "id": db_switch.id,
            "ip_address": db_switch.ip_address,
            "hostname": db_switch.hostname,
            "brand": db_switch.brand
        }

    def list_switches(self):
        switches = self.db.query(database.Switch).all()
        return [
            {
                "id": switch.id,
                "ip_address": switch.ip_address,
                "hostname": switch.hostname,
                "brand": switch.brand
            } for switch in switches
        ]

    def update_switch(self, switch_id: int, switch: schemas.SwitchUpdate):
        db_switch = self.db.query(database.Switch).filter(database.Switch.id == switch_id).first()
        if not db_switch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Коммутатор не найден"
            )
        
        for key, value in switch.dict(exclude_unset=True).items():
            setattr(db_switch, key, value)
        
        self.db.commit()
        self.db.refresh(db_switch)
        return {
            "id": db_switch.id,
            "ip_address": db_switch.ip_address,
            "hostname": db_switch.hostname,
            "brand": db_switch.brand
        }

    def delete_switch(self, switch_id: int):
        db_switch = self.db.query(database.Switch).filter(database.Switch.id == switch_id).first()
        if not db_switch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Коммутатор не найден"
            )
        
        self.db.delete(db_switch)
        self.db.commit()
        return {"detail": "Коммутатор удален"}
