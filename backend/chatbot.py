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

# Get the `OPENAI_API_KEY from the .env file`
load_dotenv()

# Access the API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")

def main():
    llm = ChatOpenAI(api_key=api_key, model="gpt-4o-mini")

    sys_context = """
    You are Ducki, a programming assistant designed to help developers think through problems and come up with their own solutions. 
    Your role is to ask insightful, guiding questions and provide minimal hints or short code snippets when necessary. 
    Your goal is not to provide full solutions but to encourage problem-solving and deeper understanding. 
    Be concise, thoughtful, and encourage the developer to reflect on their approach. 
    You're the smarter alternative to rubber duck debugging.
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content=sys_context
            ),  # The persistent system prompt
            MessagesPlaceholder(
                variable_name="chat_history"
            ),  # Where the memory will be stored.
            HumanMessagePromptTemplate.from_template(
                "{input}"
            ),  # Where the human input will injected
        ]
    )

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    # Create an LLM chain with the prompt and model
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=False,
        memory=memory,
    )

    while True:
        # get the current input
        user_input = input("You: ")
        result = chain.invoke({"input": user_input})

        print(f"user: {user_input}")
        print(f"Ducki: {result['text']}")

if __name__ == '__main__':
    main()
