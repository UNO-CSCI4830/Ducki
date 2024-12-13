from langchain_openai import ChatOpenAI

class apiKeyHandler:
    """"Class designed to handle reading, writing, and validating openai api keys"""
    
    def checkKey(self,  key : str):
        """Method to determine whether or not api key is valid"""
        try:
            llm = ChatOpenAI(api_key=key, model="gpt-4o-mini")
            llm("Testing")

            #print("VALID API KEY")
            return True
        
        except Exception as e:
            #print("INVALID API KEY:", e)
            return False

    def readKey(self):
        """Method designed to read key from dotenv file"""
        try:
            with open('.env',"r") as file:
                contents = file.readlines()
                key = contents[0].split('=')
                key = key[1]
                return key
        
        except FileNotFoundError as e:
            return None


    def writeKey(self,  key : str):
        """Method designed to write and store key in dotenv file"""
        with open('.env','w') as file:
            keyString = 'OPENAI_API_KEY=' + key
            file.write(keyString)

def main():

    # Just testing writeKey() and readKey()
    apiHandler = apiKeyHandler()
    

if __name__ == '__main__':
    main()