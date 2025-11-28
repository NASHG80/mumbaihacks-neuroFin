@echo off
echo ===============================================
echo Starting NeuroFin backend services (NO DOCKER)
echo ===============================================

REM ----- Navigate to backend root -----
cd /d "C:\Users\Arnav Bhandari\NEUROFIN_FINAl!\neuroFin\backend\neurofin_backend"

echo Starting API service...
start cmd /k "cd api && python server.py"

echo Starting Risk Agent...
start cmd /k "cd agent && python risk_agent.py"

echo Starting Forecast Service...
start cmd /k "cd forecast && python forecast_service.py"

echo Starting Kalman Smoother...
start cmd /k "cd kalman && python kalman_service.py"

echo Starting Agentic AI (LangGraph)...
start cmd /k "cd agent && python langgraph_flow.py"

echo ===============================================
echo All services launched successfully.
echo ===============================================
pause
