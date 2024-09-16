from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse

app = FastAPI()

class Message(BaseModel):
    text: str

@app.post("/api/message")
async def receive_message(message: Message):
    print(f"Received message: {message.text}")
    confirmation = {
        "confirmation": f"Message '{message.text}' received successfully!"
    }
    return JSONResponse(content=confirmation, status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
