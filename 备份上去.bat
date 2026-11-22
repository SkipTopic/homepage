@echo off
setlocal
cd /d "%~dp0"

echo.
echo   ==============================================
echo     网页备份仓库 - 归档当前全部进度
echo     github.com/SkipTopic/webpage-backup
echo   ==============================================
echo.

git --git-dir=.git-backup config core.worktree "%~dp0."

git --git-dir=.git-backup --work-tree="%~dp0." add -A -f -- . ":(exclude).git-backup" ":(exclude).playwright-mcp"

git --git-dir=.git-backup --work-tree="%~dp0." diff --cached --quiet
if errorlevel 1 (
  git --git-dir=.git-backup commit -q -m "备份 %date% %time:~0,8%"
  echo   [1/2] 已创建本地快照
) else (
  echo   [1/2] 没有新变化
)

git --git-dir=.git-backup push origin main
if errorlevel 1 (
  echo.
  echo   [2/2] 推送失败 - 检查网络后重跑一次
) else (
  echo   [2/2] 已同步到云端
)

echo.
echo   完成。窗口可以关掉了。
pause
