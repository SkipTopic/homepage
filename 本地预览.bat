@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   Starting local preview server...
echo.

set PYEXE=
where python >nul 2>nul && set PYEXE=python
if not defined PYEXE (where py >nul 2>nul && set PYEXE=py -3)
if not defined PYEXE (
  echo   Python not found.
  echo   Install Python 3 first, or ask AI to set up another static server.
  pause
  exit /b 1
)

start "homepage-preview" /min cmd /c %PYEXE% -m http.server 8123 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8123/"

echo   Preview: http://127.0.0.1:8123/
echo.
echo   Keep the minimized "homepage-preview" window open.
echo   Close that window to stop the server.
echo.
timeout /t 4 /nobreak >nul
