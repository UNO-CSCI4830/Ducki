import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory


"""
SOMETHING TO ADD: 
somewhere on the frontend, we should make a form that screens the user and writes the output to a file.
We can then take that information and inject it into the prompt so that we can essentially create a 
profile for the user. This can just be stored in a json file so that the user doesn't have to fill out 
the form each time they open the app. There SHOULD be an option to retake the screening.
"""

class Chatbot:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = self.initialize_llm()
        self.prompt = self.create_prompt_template()
        self.memory = self.initialize_memory()
        self.chain = self.create_chain()

        # Add an initial AI message to the memory
        self.add_init_message_to_memory()

    def initialize_llm(self):
        """Initializes the language model with the provided API key."""
        return ChatOpenAI(api_key=self.api_key, model="gpt-4o-mini")

    def create_prompt_template(self):
        """Creates the prompt template used by the chatbot."""
        sys_context = """
        You are Ducki, a programming assistant designed to help developers think through problems and come up with their own solutions. 
        Your role is to ask insightful, guiding questions and provide minimal hints or short code snippets when necessary. 
        Your goal is not to provide full solutions but to encourage problem-solving and deeper understanding. 
        Be concise, thoughtful, and encourage the developer to reflect on their approach. 
        You're the smarter alternative to rubber duck debugging.
        """
        return ChatPromptTemplate.from_messages([
            SystemMessage(content=sys_context),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{input}"),
        ])

    def initialize_memory(self):
        """Initializes conversation memory for chat history."""
        return ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    def create_chain(self):
        """Creates an LLM chain that integrates the model, prompt, and memory."""
        return LLMChain(
            llm=self.llm,
            prompt=self.prompt,
            verbose=False,
            memory=self.memory,
        )

    def send_init_message(self):
        """Returns the initial message for the chatbot."""
        return "Hello, world! I am Ducki, your rubber-duck programming companion. How may I help?"

    def add_init_message_to_memory(self):
        """Adds the initial message to memory for continuity in conversations."""
        init_message = self.send_init_message()
        self.memory.chat_memory.add_ai_message(init_message)

    def generate_response(self, user_input: str):
        """Generates a response based on the user's input."""
        response = self.chain.invoke({"input": user_input})
        return response['text']


if __name__ == '__main__':
    # Get the `OPENAI_API_KEY` from the .env file
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")

    ducki = Chatbot(api_key=api_key)
    
    while True:
        user_input = input("You: ")
        response = ducki.generate_response(user_input)

        print(f"user: {user_input}")
        print(f"Ducki: {response}")