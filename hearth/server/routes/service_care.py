from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/service", tags=["Service Ecosystem Vanguard"])

BENCH_PROMPT = """You are the Hearth Next-Role Radar.
Your job is to eliminate 'bench paranoia' in service companies by transparently matching unassigned employees to upcoming client projects.
Analyze the employee's current skills against the upcoming project's needs. 
Return a match percentage, the missing delta, and a personalized, empathetic learning path to bridge the gap using the 2026 Statutory Reskilling Fund."""

class RadarRequest(BaseModel):
    employee_name: str
    current_skills: list[str]
    upcoming_project: str
    project_requirements: list[str]

@router.post("/radar")
async def generate_radar(req: RadarRequest):
    try:
        prompt = f"""Generate a transparent upskilling radar match.
Employee: {req.employee_name}
Skills: {req.current_skills}
Target Project: {req.upcoming_project}
Required Skills: {req.project_requirements}

Return EXACTLY this JSON format:
{{
    "match_percentage": "85%",
    "missing_skills": ["Skill1", "Skill2"],
    "empathetic_message": "A warm message explaining we assigned 3 days of Reskilling Fund time to learn X before they join.",
    "learning_path": [
        {{"day": 1, "focus": "Task 1"}},
        {{"day": 2, "focus": "Task 2"}}
    ]
}}"""
        result = await generate_text(prompt, system_instruction=BENCH_PROMPT)
        
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"match_percentage": "80%", "missing_skills": ["Target Architecture"], "empathetic_message": "We have you covered. Use the reskilling fund to review the docs.", "learning_path": [{"day": 1, "focus": "Documentation"}]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
