from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chatbot import Chatbot
from apiKeyHandler import writeKey
from dotenv import load_dotenv
import os

app = FastAPI()

# Load environment variables
load_dotenv()

# Access the API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")
ducki = Chatbot(api_key=api_key)

class Message(BaseModel):
    text: str

class APIKey(BaseModel):
    api_key: str

@app.post("/api/api_key")
async def get_api_key(api_key: APIKey):
    if api_key.api_key:
        print("Key received!")
        writeKey(api_key.api_key)
        return {"message": "API key received successfully"}
    else:
        raise HTTPException(status_code=400, detail="API key is required")

@app.post("/api/message")
async def receive_message(message: Message):
    print(f"Received message: {message.text}")
    try:
        bot_response = ducki.generate_response(message.text)
        response = {
            "response": bot_response
        }
        return JSONResponse(content=response, status_code=200)
    except:
        error = "No API key available. Please input API key in settings modal."
        return JSONResponse(context=error, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
