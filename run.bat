@echo off
call ./bat/install.bat
start http://localhost:3000/
node index.js
echo Server stopped. Press any key to exit...
pause
