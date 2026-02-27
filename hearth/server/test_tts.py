import os
import asyncio
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

async def test_tts():
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print("Sending request to gemini-2.5-flash-preview-tts...")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents="Thank you for sharing that with me. I hear the exhaustion in your voice.",
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Kore",
                        )
                    )
                ),
            ),
        )
        print("Response received.")
        print(f"Candidates count: {len(response.candidates)}")
        if response.candidates:
            candidate = response.candidates[0]
            print(f"Content: {candidate.content}")
            print(f"Finish reason: {candidate.finish_reason}")
            if candidate.content and candidate.content.parts:
                part = candidate.content.parts[0]
                print(f"Part type: {type(part)}")
                print(f"Has inline_data? {hasattr(part, 'inline_data')}")
            else:
                print("No parts in content.")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test_tts())
