from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/translate", tags=["Translation"])

SYSTEM_PROMPT = """You are a highly professional, culturally-sensitive translator for the Hearth Cultural Operating System.

RULES:
1. Translate EVERYTHING into the target language. Do not leave any part in the original language.
2. Maintain the original meaning, tone, and structure as closely as possible.
3. If the text contains technical terms (legal, financial, HR, migration), use the correct local equivalents in the target language.
4. Keep formatting: if there are bullet points, lists, or paragraphs, preserve them exactly.
5. The tone should always remain warm, dignified, and empathetic."""

class TranslateRequest(BaseModel):
    text: str
    target_language: str  # "HI" for Hindi, "KA" for Kannada

@router.post("/")
async def translate_text(req: TranslateRequest):
    try:
        lang_name = "Hindi (Devanagari script)" if req.target_language == "HI" else "Kannada (Kannada script)"
        
        prompt = f"""You are a professional translator. Translate the following text into {lang_name}.

TEXT TO TRANSLATE:
\"\"\"
{req.text}
\"\"\"

RULES:
1. Translate EVERYTHING into {lang_name}. Do not leave any part in the original language.
2. Maintain the original empathetic tone, meaning, and structure.
3. Use correct local equivalents for technical terms.
4. Preserve ALL formatting (bullet points, paragraphs, emojis).
5. Return ONLY the fully translated text in {lang_name}."""

        result = await generate_text(prompt, system_instruction=SYSTEM_PROMPT)
        return {"translated_text": result.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
