import os
from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key present: {bool(api_key)}")
client = genai.Client(api_key=api_key)

try:
    models = client.models.list()
    flash_models = [m.name for m in models if "flash" in m.name]
    print(f"Available Flash models: {flash_models[:5]}")
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Hello, this is a test. Reply with 'Working'."
    )
    print("Response:", response.text)
except errors.APIError as e:
    print(f"APIError: {e.code} {e.message}")
    print(e.details)
except Exception as e:
    print(f"Error: {e}")
