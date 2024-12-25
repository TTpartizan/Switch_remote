from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import database, security, network_utils, admin_routes, auth_routes
from typing import List
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Подключаем роутеры
app.include_router(admin_routes.admin_router)
app.include_router(auth_routes.auth_router)

def get_current_user_or_none(request: Request):
    try:
        token = request.cookies.get("access_token")
        if not token:
            return None
        
        db = database.SessionLocal()
        user = security.get_current_user(token, db)
        db.close()
        return user
    except:
        return None

@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/admin", response_class=HTMLResponse)
def admin_page(request: Request):
    user = get_current_user_or_none(request)
    if not user or not user.is_admin:
        return RedirectResponse(url="/login")
    
    return templates.TemplateResponse(
        "admin.html", 
        {
            "request": request, 
            "username": user.username
        }
    )

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    user = get_current_user_or_none(request)
    if not user:
        return RedirectResponse(url="/login")
    
    db = database.SessionLocal()
    switches = db.query(database.Switch).all()
    commands = db.query(database.Command).all()
    db.close()
    
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request, 
            "switches": switches, 
            "commands": commands,
            "username": user.username,
            "is_admin": user.is_admin
        }
    )

@app.post("/execute-command/")
def execute_command(
    request: Request,
    switch_ip: str, 
    command_template: str, 
    port: str = None
):
    user = get_current_user_or_none(request)
    if not user:
        raise HTTPException(status_code=401, detail="Требуется авторизация")

    # Заменяем placeholder порта, если существует
    if port and 'х' in command_template:
        command = command_template.replace('х', port)
    else:
        command = command_template

    result = network_utils.execute_switch_command(switch_ip, command)
    return result

@app.get("/logout")
def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie("access_token")
    return response

@app.get("/me")
def read_users_me(request: Request):
    user = get_current_user_or_none(request)
    if not user:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    return {"username": user.username, "is_admin": user.is_admin}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
