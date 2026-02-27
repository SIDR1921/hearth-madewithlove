import os
from dotenv import load_dotenv
from google import genai
load_dotenv()
try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Say hello"
    )
    print("1.5 Success:", response.text)
except Exception as e:
    print("1.5 Error:", e)
