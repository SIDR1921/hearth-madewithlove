import asyncio
import edge_tts

async def main():
    try:
        text = "Hello world"
        voice = "en-US-AriaNeural"
        print(f"Starting edge-tts with voice {voice}")
        communicate = edge_tts.Communicate(text, voice)
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                print(f"Got audio chunk of size {len(chunk['data'])}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
