import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chatbot import Chatbot

app = FastAPI()

# Get the `OPENAI_API_KEY from the .env file`
load_dotenv()

# Access the API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")
ducki = Chatbot(api_key=api_key)
class Message(BaseModel):
    text: str

@app.post("/api/message")
async def receive_message(message: Message):
    print(f"Received message: {message.text}")
    bot_response = ducki.generate_response(message.text)
    response = {
        "response": f"{bot_response}"
    }
    return JSONResponse(content=response, status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
