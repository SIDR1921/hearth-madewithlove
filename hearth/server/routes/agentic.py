"""
Pathfinder Agent — generates "Next Identity" career paths
Learning Path — suggests YouTube videos based on skill shortfalls
Departure Documents — generates acknowledgments, contributions, recommendations, thank you note
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api", tags=["Agentic Features"])

# ─── PATHFINDER ────────────────────────────────

PATHFINDER_PROMPT = """You are the Pathfinder Agent of Hearth — a People-First Cultural Operating System.
You analyze an employee's current skill velocity, legacy vault contributions, and growth trajectory
to generate a "Next Identity" — a specific, actionable career evolution path.

Rules:
- Be SPECIFIC. Not "become a leader" but "From Backend Engineer to AI Systems Architect"
- Base recommendations on their ACTUAL skills and demonstrated growth patterns
- Suggest a concrete 90-day project that would accelerate this transition
- Identify the ONE skill gap that matters most
- Name a real-world role model who made a similar transition
- Frame everything as aspiration, never deficit

Return JSON:
{
  "current_identity": "What they are now",
  "next_identity": "What they're becoming",
  "transition_title": "e.g., From Backend Dev to AI Architect",
  "evidence": "Why this path makes sense based on their data",
  "ninety_day_project": {"title": "...", "description": "...", "milestones": ["Week 1-2: ...", "Week 3-6: ...", "Week 7-12: ..."]},
  "key_skill_gap": "The ONE skill to focus on",
  "role_model": {"name": "...", "story": "Brief inspiring transition story"},
  "youtube_resources": [{"title": "...", "search_query": "...", "why": "..."}]
}"""

class PathfinderRequest(BaseModel):
    employee_name: str
    current_role: str
    skills: list[str] = []
    skill_velocity: dict = {}
    legacy_contributions: str = ""

@router.post("/pathfinder")
async def pathfinder(req: PathfinderRequest):
    try:
        prompt = f"""Generate a Next Identity career path for:

Employee: {req.employee_name}
Current Role: {req.current_role}
Skills: {', '.join(req.skills) if req.skills else 'Not specified'}
Skill Velocity: {json.dumps(req.skill_velocity) if req.skill_velocity else 'Not tracked'}
Legacy Contributions: {req.legacy_contributions or 'Not documented yet'}

Create a specific, inspiring career evolution path."""
        result = await generate_text(prompt, system_instruction=PATHFINDER_PROMPT)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"next_identity": result, "transition_title": "Explorer", "ninety_day_project": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── LEARNING PATH (YouTube) ────────────────────

LEARNING_PROMPT = """You are the Learning Guide of Hearth. You suggest specific YouTube video topics
that address an employee's skill shortfalls, framed as GROWTH opportunities, never deficits.

Rules:
- Suggest 5-7 specific YouTube search queries that would find high-quality learning content
- Mix technical skills with soft skills (communication, leadership, empathy)
- Include at least one video about the HUMAN side of their role
- For each, explain WHY this matters for their growth
- Include estimated watch time and difficulty level

Return JSON:
{
  "learning_theme": "Overall learning theme",
  "videos": [
    {
      "title": "Suggested video topic",
      "search_query": "Exact YouTube search query",
      "channel_suggestion": "Recommended channel if known",
      "why": "Why this matters for their growth",
      "duration_est": "15 min",
      "difficulty": "Beginner/Intermediate/Advanced",
      "pillar": "Which Love as Strategy pillar this serves"
    }
  ],
  "weekly_plan": "A gentle 4-week learning schedule"
}"""

class LearningPathRequest(BaseModel):
    employee_name: str
    role: str
    skill_gaps: list[str] = []
    coaching_context: str = ""
    interests: str = ""

@router.post("/coaching/learning-path")
async def learning_path(req: LearningPathRequest):
    try:
        prompt = f"""Generate a YouTube learning path for:

Employee: {req.employee_name}
Role: {req.role}
Skill Gaps: {', '.join(req.skill_gaps) if req.skill_gaps else 'General growth'}
Coaching Context: {req.coaching_context or 'General development'}
Interests: {req.interests or 'Not specified'}

Suggest specific YouTube videos that scaffold their growth."""
        result = await generate_text(prompt, system_instruction=LEARNING_PROMPT)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"learning_theme": "Growth", "videos": [], "weekly_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── DEPARTURE DOCUMENTS ────────────────────────

DEPARTURE_DOCS_PROMPT = """You are the Departure Legacy Architect of Hearth.
When an employee leaves, you generate a COMPLETE dignity package — not an exit form.

Generate these documents:
1. ACKNOWLEDGMENT LETTER — A warm, specific letter acknowledging their contributions. Not corporate boilerplate.
2. CONTRIBUTION RECORD — A detailed list of their key contributions, projects, and impact.
3. RECOMMENDATION LETTER — A strong recommendation letter highlighting their strengths and growth.
4. THANK YOU NOTE — A heartfelt thank you note from the organization. Personal, not formulaic.
5. KNOWLEDGE TRANSFER CHECKLIST — Key knowledge areas they hold and transfer status.

Rules:
- Be SPECIFIC — use their name, role, and actual contributions
- Write with warmth. These documents represent the organization's CHARACTER.
- The recommendation should be strong enough to actually help them
- The thank you note should make them feel valued as a HUMAN, not just a worker
- Include metrics where possible (projects shipped, team impact, mentorship)

Return JSON:
{
  "acknowledgment_letter": "Full text of formal acknowledgment",
  "contribution_record": {"summary": "...", "key_projects": [{"name": "...", "impact": "..."}], "metrics": {"projects": 0, "mentored": 0}},
  "recommendation_letter": "Full text of recommendation",
  "thank_you_note": "Full text of personal thank you",
  "knowledge_transfer": [{"area": "...", "priority": "high/medium/low", "successor": "TBD"}],
  "farewell_message": "A brief message for the team Slack/email"
}"""

class DepartureDocsRequest(BaseModel):
    employee_name: str
    role: str
    tenure_months: int
    key_contributions: str
    team_name: str = ""
    manager_name: str = ""
    next_destination: str = ""

@router.post("/departure/generate-docs")
async def generate_departure_docs(req: DepartureDocsRequest):
    try:
        prompt = f"""Generate a complete Departure Legacy Package for:

Employee: {req.employee_name}
Role: {req.role}
Tenure: {req.tenure_months} months
Team: {req.team_name or 'Engineering'}
Manager: {req.manager_name or 'Not specified'}
Key Contributions: {req.key_contributions}
Next Destination: {req.next_destination or 'Not disclosed'}

Generate all 5 documents with warmth, specificity, and dignity."""
        result = await generate_text(prompt, system_instruction=DEPARTURE_DOCS_PROMPT)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"acknowledgment_letter": result, "contribution_record": {}, "recommendation_letter": "", "thank_you_note": "", "knowledge_transfer": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
