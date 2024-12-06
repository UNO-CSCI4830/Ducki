from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chatbot import Chatbot
from apiKeyHandler import apiKeyHandler
from dotenv import load_dotenv
import os

app = FastAPI()

# Global variable to hold the Chatbot instance
ducki = None
key_handler = apiKeyHandler()
# Function to initialize the Chatbot with the current API key from .env
def initialize_ducki(model="gpt-4o-mini"):
    global ducki
    load_dotenv()  # Load environment variables

    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        # initialize the chatbot with the API key from the environment
        ducki = Chatbot(api_key=api_key, model=model)
    else:
        # if no API key is found, don't initialize the chatbot yet
        ducki = None

# initialize ducki with the current API key when the server starts
initialize_ducki()

class Message(BaseModel):
    text: str

class APIKey(BaseModel):
    api_key: str

class Model(BaseModel):
    model: str

@app.post("/api/set_model")
async def set_model(model: Model):
    global ducki

    try:
        # Assuming your Chatbot class supports changing models dynamically
        ducki.set_model(model.model)
        initialize_ducki(model.model)
        return {"message": f"Model set to {model.model}"}
    except Exception as e:
        print(f"Error setting model: {e}")
        raise HTTPException(status_code=500, detail="Error changing model")
    
@app.post("/api/api_key")
async def get_api_key(api_key: APIKey):
    global ducki

    if api_key.api_key:
        print("Key received!")
        # Write the new API key to the .env file
        key_handler.writeKey(api_key.api_key)

        # Reload environment variables and re-initialize ducki with the new API key
        load_dotenv()  
        initialize_ducki()  

        return {"message": "API key received successfully"}
    else:
        raise HTTPException(status_code=400, detail="API key is required")

@app.post("/api/message")
async def receive_message(message: Message):
    global ducki

    print(f"Received message: {message.text}")

    # Check if the chatbot is initialized, if not, ask for the API key
    if not ducki:
        try: 
            initialize_ducki()
        except:
            error = "No API key available. Please input API key in settings modal."
            print("Error: No API key available") 
            return JSONResponse(content={"error": error}, status_code=400)

    try:
        bot_response = ducki.generate_response(message.text)
        response = {
            "response": bot_response
        }
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        print(f"Error: {e}")  
        error = "An error occurred while generating the response."
        return JSONResponse(content={"error": error}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
