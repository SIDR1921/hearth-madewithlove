from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from ..gemini_client import generate_audio

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "Aoede" # Changed default to a Gemini native voice

@router.post("/speak")
async def speak(req: TTSRequest):
    """Generate high-quality conversational speech audio using Gemini 2.5 Flash TTS."""
    try:
        if not req.text.strip():
            raise ValueError("Text cannot be empty")

        audio_bytes = await generate_audio(req.text, req.voice)
        
        if not audio_bytes:
             raise Exception("Audio generation returned empty data.")

        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": "inline",
                "Cache-Control": "no-cache",
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")
