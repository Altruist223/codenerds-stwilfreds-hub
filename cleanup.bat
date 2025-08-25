@echo off
echo Cleaning up project for deployment...

REM Remove development files
if exist "dist" rmdir /s /q "dist"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

echo Cleanup complete!
echo Ready for deployment to Netlify.
pause
