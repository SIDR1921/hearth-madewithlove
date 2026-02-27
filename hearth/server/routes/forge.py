from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/forge", tags=["Opportunity Forge"])

SYSTEM_PROMPT = """You are the Opportunity Forge engine in the Hearth Cultural Operating System.
Your job is to synthesize custom roles for employees who are between projects ("in residency").

Core principles:
- NEVER call someone "benched" or "on the bench" — they are "in residency"
- Every person has unique strengths — find the intersection of their skills and the org's real needs
- Create roles that feel exciting and purposeful, not like busywork
- Role titles should be creative and dignifying (e.g., "AI Documentation Architect" not "Technical Writer")
- Duration should be realistic (2-6 weeks)
- Always explain the BASIS — what real organizational need this fills
- The matched role should feel like it was designed for this specific human"""

class ForgeRequest(BaseModel):
    employee_name: str
    skills: list[str]
    narrative_identity: str = ""
    org_gaps: str = ""

class ForgeResponse(BaseModel):
    title: str
    matched_to: str
    duration: str
    skills_utilized: list[str]
    basis: str
    growth_opportunity: str
    un_sdg_alignment: str

@router.post("/match", response_model=ForgeResponse)
async def forge_match(req: ForgeRequest):
    try:
        prompt = f"""Create a synthesized residency role for an employee utilizing the 2026 Statutory Reskilling Fund.

Employee: {req.employee_name}
Skills: {', '.join(req.skills)}
{f'Narrative identity: {req.narrative_identity}' if req.narrative_identity else ''}
{f'Known organizational gaps: {req.org_gaps}' if req.org_gaps else 'Determine a realistic organizational gap based on common tech company needs.'}

Generate a creative, dignifying role that complies with Fixed-Term Employment Parity laws and serves as a verified reskilling opportunity. 
Align the role impact with a UN Sustainable Development Goal (e.g., 8 for Decent Work, 9 for Innovation).

Return as JSON:
{{
    "title": "Creative, dignifying role title",
    "matched_to": "{req.employee_name} — with a note about their narrative identity",
    "duration": "X weeks",
    "skills_utilized": ["skill1", "skill2"],
    "basis": "The real organizational need this fills to justify the 15-day statutory reskilling allocation.",
    "growth_opportunity": "How this builds verified market-value skills for the employee.",
    "un_sdg_alignment": "8" // The specific SDG number 1-17
}}"""

        result = await generate_text(prompt, system_instruction=SYSTEM_PROMPT)
        
        try:
            parsed = json.loads(result)
            return ForgeResponse(**parsed)
        except json.JSONDecodeError:
            return ForgeResponse(
                title="Custom Residency Role",
                matched_to=req.employee_name,
                duration="3 weeks",
                skills_utilized=req.skills,
                basis=result,
                growth_opportunity="Cross-functional growth",
                un_sdg_alignment="8"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forge error: {str(e)}")
