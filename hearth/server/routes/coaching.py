from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/coaching", tags=["Forgiveness Weaver"])

SYSTEM_PROMPT = """You are a coaching script generator for the Hearth Cultural Operating System.
You help managers have difficult but empathetic conversations with their team members.

Core principles:
- Scripts should feel like a warm, honest human conversation — not HR boilerplate
- Always lead with acknowledging the HUMAN behind the situation
- Never blame — always seek systemic causes (overwork, unclear expectations, lack of support)
- Frame everything as growth, never punishment
- Use "I notice" and "I'm wondering" language patterns
- Each script line should be a single, powerful sentence
- Generate exactly 4-5 script lines that flow naturally as a conversation opening
- The manager should feel empowered but also vulnerable — coaching is a two-way mirror"""

class CoachingRequest(BaseModel):
    situation: str
    employee_name: str
    context: str = ""
    language: str = "EN"

class CoachingResponse(BaseModel):
    title: str
    context_summary: str
    script: list[str]
    tone_guidance: str

@router.post("/script", response_model=CoachingResponse)
async def generate_coaching_script(req: CoachingRequest):
    try:
        lang_note = ""
        if req.language == "हिं":
            lang_note = "\nGenerate the script in Hindi (Devanagari). Keep the empathetic, growth-oriented tone."
        elif req.language == "ಕನ್ನ":
            lang_note = "\nGenerate the script in Kannada. Keep the empathetic, growth-oriented tone."

        prompt = f"""A manager needs a coaching conversation script.

Situation: {req.situation}
Employee name: {req.employee_name}
{f'Additional context: {req.context}' if req.context else ''}
{lang_note}

Generate a coaching script. Return as JSON:
{{
    "title": "A brief, human title for this context (e.g., 'Overwork Pattern Detected')",
    "context_summary": "One paragraph synthesizing the human story behind this situation",
    "script": ["line 1", "line 2", "line 3", "line 4"],
    "tone_guidance": "Brief guidance on tone and body language for the manager"
}}"""

        result = await generate_text(prompt, system_instruction=SYSTEM_PROMPT)
        
        try:
            parsed = json.loads(result)
            return CoachingResponse(**parsed)
        except json.JSONDecodeError:
            return CoachingResponse(
                title="Coaching Conversation",
                context_summary=req.situation,
                script=[result],
                tone_guidance="Approach with warmth and genuine curiosity."
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Coaching error: {str(e)}")

class LearningPathRequest(BaseModel):
    employee_name: str
    role: str
    skill_gaps: list[str] = []
    coaching_context: str = ""
    interests: str = ""

@router.post("/learning-path")
async def generate_learning_path(req: LearningPathRequest):
    """Generate a personalized YouTube learning path for an employee."""
    try:
        gaps_str = ", ".join(req.skill_gaps) if req.skill_gaps else "General role upskilling"
        prompt = f"""Create a highly personalized, empathetic YouTube learning path.
Employee: {req.employee_name}
Role: {req.role}
Skill Gaps to Address: {gaps_str}
Context: {req.coaching_context}

Return ONLY raw JSON in this exact format, with NO markdown formatting, NO backticks, NO ```json:
{{
    "learning_theme": "A motivating, dignified title for this journey",
    "videos": [
        {{
            "title": "Exact Title of a real or highly probable YouTube Video",
            "search_query": "Optimized YouTube search terms to find this video",
            "why": "Why this specifically helps {req.employee_name} right now",
            "duration_est": "e.g., 15 mins",
            "difficulty": "Beginner | Intermediate | Advanced"
        }},
        // Need exactly 3-4 excellent video recommendations
    ],
    "weekly_plan": "A short, empathetic paragraph on how to integrate this into their week without burning out."
}}"""
        
        result = await generate_text(prompt, system_instruction="You are an empathetic technical learning curator.")
        # Clean any accidental markdown from the LLM
        clean_result = result.strip()
        if clean_result.startswith("```json"):
            clean_result = clean_result[7:]
        if clean_result.endswith("```"):
            clean_result = clean_result[:-3]
            
        return json.loads(clean_result.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Learning path error: {str(e)}")
