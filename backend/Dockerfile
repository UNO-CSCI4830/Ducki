FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements into the container
# COPY backend/requirements.txt . 
COPY requirements.txt .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt --default-timeout=100

# Copy the backend code into the container
# COPY backend/ /app
COPY . /app

# Expose the port used for the API
EXPOSE 5000

# Run the backend server
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "5000"]
