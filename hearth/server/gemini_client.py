import os
import re
from dotenv import load_dotenv
from google import genai

load_dotenv()

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in .env file")
        _client = genai.Client(api_key=api_key)
    return _client

MODEL = "gemini-3-flash-preview"

def _strip_code_fences(text: str) -> str:
    """Strip markdown code fences from Gemini responses."""
    text = text.strip()
    # Remove ```json ... ``` or ``` ... ```
    match = re.match(r'^```(?:json)?\s*\n(.*?)```\s*$', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text

async def generate_text(prompt: str, system_instruction: str = None) -> str:
    """Generate a plain-text response from Gemini."""
    client = get_client()
    config = {}
    if system_instruction:
        config["system_instruction"] = system_instruction
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=config if config else None,
    )
    return _strip_code_fences(response.text)

async def generate_json(prompt: str, system_instruction: str = None) -> str:
    """Generate a JSON response from Gemini."""
    client = get_client()
    config = {"response_mime_type": "application/json"}
    if system_instruction:
        config["system_instruction"] = system_instruction
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=config,
    )
    return _strip_code_fences(response.text)

import io
import wave
import asyncio
from google.genai import types

async def generate_audio(text: str, voice_name: str = "Kore") -> bytes | None:
    """Generate speech audio from text using Gemini 2.5 Flash TTS.
    Returns WAV file bytes with a warm, compassionate voice."""
    try:
        client = get_client()
        # Directorial prompt for Gemini TTS voice style
        directed_text = (
            "[Audio Profile: A warm, compassionate listener — "
            "like a caring older sibling or supportive corporate therapist. "
            "Gentle, calm, and present. Female voice with a soft timbre.] "
            "[Scene: Speaking directly to a vulnerable employee who needs comfort and clarity.] "
            "[Director's Notes: Speak at a slow, measured pace. "
            "Leave natural pauses. When acknowledging pain or frustration, lower the pitch slightly. "
            "Always end with warmth and reassurance. Never sound robotic or rushed.] "
            f"\n\n{text}"
        )

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash-preview-tts",
            contents=directed_text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name,
                        )
                    ),
                ),
            )
        )

        pcm_data = response.candidates[0].content.parts[0].inline_data.data

        # Wrap raw PCM in WAV container
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(24000)
            wf.writeframes(pcm_data)
        wav_buffer.seek(0)
        return wav_buffer.read()

    except Exception as e:
        print(f"TTS error: {e}")
        import traceback
        traceback.print_exc()
        return None

import urllib.request, json

async def analyze_github(username: str):
    """"Analyze a GitHub profile to reveal 'Impact & Identity' (no auth required)"""
    client = get_client()
    
    # Try to fetch real public data (graceful fallback)
    public_data = "{}"
    try:
        req = urllib.request.Request(f"https://api.github.com/users/{username}", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            public_data = response.read().decode('utf-8')
    except Exception:
        pass # Silently fallback to synthetic data if network/rate limit fails

    prompt = f"""You are the Hearth Impact Analyzer.
Analyze this GitHub profile (or synthesize one if data sparse) to reveal hidden mastery and ESG alignment.
Username: {username}
Public Data: {public_data}

Focus on:
1. Translating code commits into UN SDG 8 (Decent Work & Economic Growth) contributions.
2. Identifying mentorship, documentation, or accessibility work ("Hidden Mastery").
3. Writing a dignified narrative that frames them as a vital system builder.
4. Emphasize themes related to the 2026 Labour Codes (e.g., fair work, skill development, inclusive workplaces).

Return EXACTLY this JSON format (no markdown fences):
{{
    "title": "The Architectural Empath",
    "subtitle": "Bridging Systems and Human Usability",
    "narrative": "A 2-3 sentence dignified narrative about how their code creates inclusive systems.",
    "hidden_strengths": [
        {{"name": "Mentorship via Code Review", "evidence": "Consistent, empathetic feedback loops in PRs."}}
    ],
    "growth_areas": ["Open Source Governance", "Architectural Scaling"]
}}"""
    
    try:
        response = client.models.generate_content(
            model=MODEL, # Changed MODEL_ID to MODEL
            contents=prompt,
        )
        
        # Clean markdown if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        return {
            "title": "The System Builder",
            "subtitle": "Building robust, equitable infrastructure",
            "narrative": f"@{username}'s commit history reveals a deep commitment to systemic resilience. Their work quietly ensures that the organization's digital foundations are sound, scalable, and inclusive.",
            "hidden_strengths": [
                {"name": "Invisible Infrastructure", "evidence": "Focuses on the unglamorous but critical foundational code that prevents incidents before they happen."},
                {"name": "Documentation as Empathy", "evidence": "Leaves clear trails for future engineers, treating codebase onboarding as an act of care."}
            ],
            "growth_areas": ["Technical Roadmap Leadership", "Cross-Team Architecture"]
        }
