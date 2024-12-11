import pytest
import chatbot
import apiKeyHandler
import os

key = os.getenv("OPENAI_API_KEY") # Make sure you have a valid API Key in order for the tests to work.
chatbot = chatbot.Chatbot(key)
apiKeyHandler = apiKeyHandler.apiKeyHandler()

def test_send_init_message():
    
    # Testing the init message
    assert chatbot.send_init_message() == "Hello, world! I am Ducki, your rubber-duck programming companion. How may I help?"

def test_initialize_llm():

    # Testing to make sure the LLM got initialized correctly
    assert chatbot.llm is not None
    assert chatbot.llm.model_name == "gpt-4o-mini"
    pass

def test_initialize_memory():

    # Testing to make sure the chat memory gets initialized correctly
    assert chatbot.memory is not None
    assert chatbot.memory.memory_key == 'chat_history'
    assert chatbot.memory.return_messages == True
    pass

def test_generate_response():
    
    # Test that the chat bot will correctly return a message
    response = chatbot.generate_response('Test-prompt')
    assert type(response) == str

def test_checkKey():

    # Using a valid key
    assert apiKeyHandler.checkKey(key) == True

    # Using an invalid key
    assert apiKeyHandler.checkKey('Invalid Key') == False
    
def test_readKey_and_writeKey():

    key = 'Test_key'
    
    # Test that it returns None if FileNotFoundError
    if os.path.exists('.env'):
            os.remove('.env')
    assert apiKeyHandler.readKey() == None
    
    apiKeyHandler.writeKey(key)
    assert apiKeyHandler.readKey() == key
