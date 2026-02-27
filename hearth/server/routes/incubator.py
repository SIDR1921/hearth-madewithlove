from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/incubator", tags=["Seneschal Incubator"])

INCUBATOR_PROMPT = """You are the Hearth Seneschal Incubator.
Your job is to generate meaningful internal projects for 'benched' (unassigned) employees.
The goal is to maintain dignity, build value, and keep them active.
The project MUST align with at least one of Softway's 6 Pillars (e.g., Empathy, Accountability, Forgiveness, Equality, Inclusion, Human-First).
Analyze the employee's current skills and propose an internal process-improvement or open-source tool they can build.

Return EXACTLY this JSON format:
{
    "project_title": "Title of the project",
    "pillar_alignment": "Which of the 6 pillars this serves and why (1 sentence)",
    "problem_statement": "The internal inefficiency or cultural gap this solves (2 sentences)",
    "solution_architecture": "How their specific skills will be used to build the solution (2 sentences)",
    "estimated_duration": "E.g., 2 Weeks, 1 Sprint"
}"""

class IncubatorRequest(BaseModel):
    employee_name: str
    current_skills: list[str]

@router.post("/generate-project")
async def generate_project(req: IncubatorRequest):
    try:
        prompt = f"""Generate an internal incubator project.
Employee: {req.employee_name}
Skills: {req.current_skills}"""
        
        result = await generate_text(prompt, system_instruction=INCUBATOR_PROMPT)
        
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {
                "project_title": "Internal Automation Review",
                "pillar_alignment": "Accountability - Taking ownership of internal delivery standards.",
                "problem_statement": "Internal deployments currently require manual intervention.",
                "solution_architecture": "Use Python and React to build a unified deployment dashboard.",
                "estimated_duration": "1 Sprint"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
