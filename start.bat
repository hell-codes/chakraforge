@echo off
echo ===================================================
echo   CHAKRAFORGE - Chakravyuha 3D Simulator Launcher
echo ===================================================

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "CHAKRAFORGE Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on port 5175...
start "CHAKRAFORGE Frontend" cmd /k "npm run dev -- --port 5175 --strictPort --host --open"

echo.
echo Both servers started!
echo Frontend: http://localhost:5175
echo Backend API: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo ===================================================
