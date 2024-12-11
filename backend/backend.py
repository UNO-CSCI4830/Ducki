from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chatbot import Chatbot
from apiKeyHandler import apiKeyHandler
from dotenv import load_dotenv, set_key
import os
from openai import AuthenticationError

app = FastAPI()

# Global variable to hold the Chatbot instance
ducki = None
key_handler = apiKeyHandler()
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

# initialize the Chatbot with the current API key from .env
def initialize_ducki():
    global ducki
    load_dotenv() 
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
    except Exception as e:
        print(f"Error: {e}")
    
    if not api_key is None:
        ducki = Chatbot(api_key=api_key)
    else:
        # don't initialize the chatbot yet
        ducki = None


# initialize ducki with the current API key when the server starts
initialize_ducki()


class Message(BaseModel):
    text: str


class APIKey(BaseModel):
    api_key: str


@app.post("/api/api_key")
async def get_api_key(api_key: APIKey):
    global ducki

    if api_key.api_key:
        key_handler.writeKey(api_key.api_key) # write the key to .env for later
        set_key(dotenv_path, "OPENAI_API_KEY", api_key.api_key) # set the value of the API key in current env

        load_dotenv(dotenv_path, override=True)
        initialize_ducki()  # re-initialize the Chatbot instance with new key
       
        success = {"message": "API key received successfully"}
        return JSONResponse(content={"message": success}, status_code=200)
    else:
        raise HTTPException(status_code=400, detail="API key is required")

@app.post("/api/message")
async def receive_message(message: Message):
    global ducki

    print(f"Received message: {message.text}")

    # Check if the chatbot is initialized
    if ducki is None:
        try: 
            initialize_ducki()
        except Exception as e:
            error = f"There was an issue initializing Ducki.\n{e}"
            return JSONResponse(content={"error": error}, status_code=400)
    try:
        bot_response = ducki.generate_response(message.text)
        response = {
            "response": bot_response
        }
        return JSONResponse(content=response, status_code=200)
    
    except AuthenticationError:
        error = "Invalid API key input. Please input API key in settings modal."
        print("Error: Invalid API key.") 
        return JSONResponse(content={"error": error}, status_code=400)
    except AttributeError:
            error = "No API key available. Please input API key in settings modal."
            print("Error: No API key available") 
            return JSONResponse(content={"error": error}, status_code=400)
    except Exception as e:
        print(f"Error: {e}")  
        error = "An error occurred while generating the response."
        return JSONResponse(content={"error": error}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
