@echo off
SET "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting FGSN Microservices Suite...

echo 1. Starting Socket Relay (Port 3005)...
start "FGSN Socket Relay" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\socket-relay && npm.cmd run dev"

echo 2. Starting Auth Gate (Port 3000)...
start "FGSN Auth Gate" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\auth-gate && npm.cmd run dev"

echo 3. Starting Admin Dashboard (Port 3001)...
start "FGSN Admin Dashboard" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\admin-dashboard && npm.cmd run dev"

echo 4. Starting Scoring Engine (Port 3002)...
start "FGSN Scoring Engine" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\scoring-engine && npm.cmd run dev"

echo 5. Starting Overlay Renderer (Port 3003)...
start "FGSN Overlay" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\broadcast-overlay && npm.cmd run dev"

echo 6. Starting Public Portal (Port 3004)...
start "FGSN Public Portal" cmd /k "SET PATH=C:\Program Files\nodejs;%%PATH%% && cd apps\public-portal && npm.cmd run dev"

echo.
echo All 6 services are launching!
echo Main Portal: http://localhost:3004
echo Admin Dashboard: http://localhost:3001
echo.
pause
