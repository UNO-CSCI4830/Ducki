import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend import app, initialize_ducki, ducki

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_ducki():
    """Reset the global ducki variable before each test"""
    global ducki
    ducki = None
    yield
    ducki = None

@pytest.fixture
def mock_chatbot():
    """Mock the Chatbot instance."""
    with patch("backend.Chatbot") as MockChatbot:
        instance = MockChatbot.return_value
        instance.generate_response.return_value = "Mocked response"
        yield MockChatbot  

@pytest.fixture
def mock_api_key_handler():
    """Mock the APIKeyHandler instance."""
    with patch("backend.key_handler.writeKey") as mock_write_key:  # Patch the specific method
        yield mock_write_key

def test_initialize_ducki(mock_chatbot):
    """Test that Ducki (Chatbot) is initialized with the API key."""
    os.environ["OPENAI_API_KEY"] = "test_api_key"
    initialize_ducki()
    mock_chatbot.assert_called_once_with(api_key="test_api_key")
    del os.environ["OPENAI_API_KEY"]

def test_get_api_key(mock_api_key_handler):
    """Test setting an API key and reinitializing Ducki."""
    response = client.post("/api/api_key", json={"api_key": "new_test_key"})
    assert response.status_code == 200
    assert response.json() == {"message": {"message": "API key received successfully"}}
    mock_api_key_handler.assert_called_once_with("new_test_key")

def test_get_api_key_missing():
    """Test error when no API key is provided."""
    response = client.post("/api/api_key", json={"api_key": ""})
    assert response.status_code == 400
    assert response.json() == {"detail": "API key is required"}

def test_receive_message_without_api_key():
    """Test error when no API key is available."""
    # Ensure no API key in environment and no ducki instance
    if "OPENAI_API_KEY" in os.environ:
        del os.environ["OPENAI_API_KEY"]
    
    response = client.post("/api/message", json={"text": "Hello, Ducki!"})
    assert response.status_code == 400 
    assert response.json() == {"error": "No API key available. Please input API key in settings modal."} or \
           response.json() ==  {"error": "Invalid API key input. Please input API key in settings modal."}

@pytest.mark.usefixtures("mock_chatbot")
def test_receive_message_with_initialized_ducki():
    """Test that the chatbot generates a response if initialized."""
    os.environ["OPENAI_API_KEY"] = "test_api_key"
    initialize_ducki()
    
    response = client.post("/api/message", json={"text": "Hello, Ducki!"})
    assert response.status_code == 200
    assert response.json() == {"response": "Mocked response"}
    
    del os.environ["OPENAI_API_KEY"]

@pytest.mark.usefixtures("mock_chatbot")
def test_receive_message_with_error_in_response_generation():
    """Test error handling when an exception occurs in response generation."""
    os.environ["OPENAI_API_KEY"] = "test_api_key"
    initialize_ducki()
    
    with patch("backend.ducki.generate_response", side_effect=Exception("Error in generating response")):
        response = client.post("/api/message", json={"text": "Cause error"})
        assert response.status_code == 500
        assert response.json() == {"error": "An error occurred while generating the response."}
    
    del os.environ["OPENAI_API_KEY"]