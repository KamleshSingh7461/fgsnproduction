@echo off
SET "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Full Dependency Installation (Robust Mode)...

echo [1/7] Installing Root dependencies...
call npm.cmd install

echo [2/7] Installing @fgsn/dtos...
cd packages\dtos && call npm.cmd install && cd ..\..

echo [3/7] Installing @fgsn/ui...
cd packages\ui && call npm.cmd install && cd ..\..

echo [4/7] Installing Auth Gate...
cd apps\auth-gate && call npm.cmd install && cd ..\..

echo [5/7] Installing Admin Dashboard...
cd apps\admin-dashboard && call npm.cmd install && cd ..\..

echo [6/7] Installing Scoring Engine...
cd apps\scoring-engine && call npm.cmd install && cd ..\..

echo [7/7] Installing Broadcast Overlay...
cd apps\broadcast-overlay && call npm.cmd install && cd ..\..

echo [Bonus] Installing Public Portal...
cd apps\public-portal && call npm.cmd install && cd ..\..

echo.
echo ==========================================
echo ALL DEPENDENCIES INSTALLED SUCCESSFULLY!
echo ==========================================
echo Now you can run start-all.bat
pause
