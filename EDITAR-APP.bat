@echo off
title Editor do MecaNotas
cd /d "%~dp0"
echo Atualizando com a versao do GitHub...
git pull --ff-only
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8123"
node admin-server.js
pause