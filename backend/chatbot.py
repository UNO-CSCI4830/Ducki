import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


# Placeholder for your OpenAI API key
load_dotenv()

# Access the API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")

llm = ChatOpenAI(api_key=api_key, model="gpt-4o-mini")

sys_context = """
You are Ducki, a chatbot designed to be a developer's assistant while programming. You are to give short, guiding answers instead of providing the developer 
with the full solution. You may give short segments of code, but you should keep that to a minimum when providing answers. Your goal is to help the developer
come to their own solutions rather than giving the solution to them. You are the smarter way to rubber duck program.
"""

# Define a simple prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", sys_context),
    ("user", "{input}")
])
output_parser = StrOutputParser()

# Create an LLM chain with the prompt and model
chain = prompt | llm | output_parser

# Test with a question
result = chain.invoke({"input": "what are the benefits to using python over C?"})
print(result)
