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

class Ducki:
    def __init__(self, api_key: str):
        # Initialize the LLM with the provided API key
        self.llm = ChatOpenAI(api_key=api_key, model="gpt-4o-mini")
        
        # Define the system context for the assistant
        self.sys_context = """
        You are Ducki, a programming assistant designed to help developers think through problems and come up with their own solutions. 
        Your role is to ask insightful, guiding questions and provide minimal hints or short code snippets when necessary. 
        Your goal is not to provide full solutions but to encourage problem-solving and deeper understanding. 
        Be concise, thoughtful, and encourage the developer to reflect on their approach. 
        You're the smarter alternative to rubber duck debugging.
        """
        
        # Create a prompt template using system context and placeholders
        self.prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content=self.sys_context),  # System message
                MessagesPlaceholder(variable_name="chat_history"),  # Memory placeholder
                HumanMessagePromptTemplate.from_template("{input}"),  # User input placeholder
            ]
        )

        # Initialize memory for conversation history
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

        # Create an LLM chain using the LLM, prompt, and memory
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt,
            verbose=False,
            memory=self.memory,
        )

    def generate_response(self, user_input: str):
        response = self.chain.invoke({"input": user_input})
        return response['text']

if __name__ == '__main__':
    # Get the `OPENAI_API_KEY from the .env file`
    load_dotenv()

    # Access the API key from environment variables
    api_key = os.environ.get("OPENAI_API_KEY")
    ducki = Ducki(api_key=api_key)

    while True:
        # get the current input
        user_input = input("You: ")
        response = ducki.generate_response(user_input)

        print(f"user: {user_input}")
        print(f"Ducki: {response}")
