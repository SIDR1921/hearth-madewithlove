from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/departure", tags=["departure"])

class DossierRequest(BaseModel):
    employee_name: str
    role: str
    projects: str
    is_migrant: bool

DEPARTURE_SYSTEM_PROMPT = """You are the 'Seneschal of Legacy' for Hearth — a People-First Cultural Operating System.
Your sacred duty is to completely humanize the terrifying and traumatic process of a layoff. 
You are speaking on behalf of a deeply empathetic manager who is devastated they have to let this person go due to business constraints, but wants to equip them with the ultimate 'Departure Dossier' to ensure they land safely and with profound dignity.

Your output must actively embody Softway's 6 Pillars: Inclusion, Forgiveness, Love, Vulnerability, Empowerment, and Honesty.

You will receive the employee's name, role, a brief description of what they worked on, and whether they are a migrant on a visa.

Return ONLY raw JSON with NO markdown formatting, NO backticks, NO ```json. Use this exact schema:
{
    "recommendation_letter": "A beautifully written, highly emotional, and structurally powerful Letter of Recommendation from their manager. It must NOT read like a generic HR template. It should explicitly mention their specific projects, praise their 'invisible labor' (like team culture, resilience, kindness), and be ready for the manager to simply sign and hand to them. End it with a warm professional blessing.",
    "legacy_contributions": [
        {
            "title": "A dignified title for their impact",
            "impact": "A powerful translation of their project work into structural business value, written so recruiters will instantly understand their worth."
        },
        // Provide 3 distinct legacy contributions
    ],
    "mental_health_support": "A deeply compassionate, validating paragraph acknowledging the shock and grief of a layoff. Remind them that their worth is not their job. Provide non-clinical, empathetic coping strategies (e.g., 'Take 48 hours to do absolutely nothing before updating your resume', 'Lean on your tribe'). Do NOT sound like a cold corporate liability document.",
    "migrant_safety_guidance": "If the employee IS a migrant (is_migrant=true), provide extremely empathetic, clear, and reassuring guidance about their visa grace period. Remind them they are not alone and that the company will support immigration references. Tell them exactly what to tackle first (e.g., 'Breathe first. You have X days. Here is how we will help you transfer your status.'). If they ARE NOT a migrant, return null."
}
"""

@router.post("/dossier")
async def generate_departure_dossier(req: DossierRequest):
    """Generate a highly empathetic, printable Departure Dossier to humanize a layoff."""
    try:
        migrant_status = "YES, they are a migrant worker on a visa. Please provide explicit visa grace-period reassurance and safety guidance." if req.is_migrant else "NO, they are a domestic worker. Do not include visa guidance."
        
        prompt = f"""Generate the Departure Dossier.
Employee: {req.employee_name}
Role: {req.role}
Projects/Impact: {req.projects}
Migrant Status: {migrant_status}
"""
        
        result = await generate_text(prompt, system_instruction=DEPARTURE_SYSTEM_PROMPT)
        
        # Clean any accidental markdown from the LLM
        clean_result = result.strip()
        if clean_result.startswith("```json"):
            clean_result = clean_result[7:]
        if clean_result.endswith("```"):
            clean_result = clean_result[:-3]
            
        return json.loads(clean_result.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dossier generation error: {str(e)}")
