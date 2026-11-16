@echo off
chcp 65001 >nul
title 医疗工艺数据库 · 本地预览
cd /d "%~dp0"

echo ============================================
echo   医疗工艺数据库 · 本地开发预览
echo   首次运行会自动安装依赖,约 1-2 分钟
echo   关闭本窗口即停止网站
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js,请先安装 18 以上版本: https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo 正在安装依赖,请稍候...
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败,请检查网络后重试
    pause
    exit /b 1
  )
)

start "" http://localhost:3000
call npm run dev
pause
