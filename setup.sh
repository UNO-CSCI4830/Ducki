#!/bin/bash

# Set up Python virtual environment and install Python dependencies
echo "Setting up Python virtual environment and installing requirements..."
python3 -m venv venv
source venv/bin/activate  # Activate the virtual environment

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing Python packages..."
pip install fastapi pydantic uvicorn langchain langchain-openai openai python-dotenv --default-timeout=100

# Node.js requirements
echo "Installing Node.js dependencies..."
npm install  # This assumes that package.json is in the root directory

echo "\n\nNow you must manually execute the command:\n\n\tsource .env\n\n"