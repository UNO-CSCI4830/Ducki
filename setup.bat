@echo off
SETLOCAL

:: Set up Python virtual environment and install Python dependencies
echo Setting up Python virtual environment and installing requirements...
python -m venv venv
call venv\Scripts\activate  :: Activate the virtual environment

echo Upgrading pip...
pip install --upgrade pip

echo Installing Python packages...
pip install fastapi pydantic uvicorn langchain langchain-openai openai python-dotenv --default-timeout=100

:: Node.js requirements
echo Installing Node.js dependencies...
npm install axios express http-proxy-middleware body-parser  :: This assumes that package.json is in the root directory

echo.
echo Now you must manually execute the command:
echo.
echo     call .env
echo.

ENDLOCAL
pause
