@echo off
title BASTEL SYSTEM CONTROL PANEL
color 0E

echo ==========================================
echo    BASTEL PVT LTD - SYSTEM STARTING...
echo ==========================================

:: 1. Flask Server එක වෙනම window එකක run කරනවා
echo [1/2] Starting Python Flask Server...
start "Python Flask Server" cmd /k "python app.py"

:: Server එක පත්තුවෙනකම් තප්පර 5ක් ඉන්නවා
timeout /t 5 /nobreak > nul

:: 2. LocalTunnel එක run කරලා ලින්ක් එක හදනවා
echo [2/2] Creating Public Secure Link...
echo ------------------------------------------
echo COPY THE LINK BELOW TO ACCESS FROM ANYWHERE
echo ------------------------------------------
start "LocalTunnel Link" cmd /k "lt --port 5000 --subdomain bastel --bypass-tunnel-reminder"

echo.
echo BASTEL System is now LIVE!
echo Use the Link in the second window to log in.
pause