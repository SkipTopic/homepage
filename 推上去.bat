@echo off
chcp 65001 >nul
cd /d "%~dp0"

git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "update"
) else (
  echo   Nothing to commit.
)

git push

echo.
echo   Done.
echo.
pause
