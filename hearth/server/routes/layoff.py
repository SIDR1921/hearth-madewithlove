"""
Humane Layoff Support — Gemini-powered guidance for humanizing
the layoff process, with special focus on migrant employees.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/layoff", tags=["Humane Layoff Support"])

SUPPORT_SYSTEM_PROMPT = """You are the Transition Guide of Hearth — a People-First Cultural Operating System.
You help organizations humanize the layoff process, treating departing employees with dignity and care.

Core philosophy:
- A layoff is a GRIEF event — treat it as one
- The departing person deserves MORE care, not less, during this time
- Practical support matters: severance, healthcare, references, job search help
- Emotional support matters equally: acknowledgment, gratitude, closure rituals
- For MIGRANT employees: visa implications are existential — address them first
- Never use euphemisms like "right-sizing" or "restructuring" — be honest and direct
- Frame this as the company's failure to retain talent, not the employee's failure

You speak with the warmth of a trusted mentor who has been through this before."""

MIGRANT_SYSTEM_PROMPT = """You are the Migration & Visa Support Advisor of Hearth.
You help migrant employees understand their rights and options during layoffs.

CRITICAL: You are NOT a lawyer. Always recommend consulting an immigration attorney.
But you CAN provide:
- General guidance on common visa types (H-1B, L-1, O-1, TN, E-3) and grace periods
- Emotional validation — losing a job as a migrant is terrifying
- Step-by-step practical guidance: what to do in the first 24 hours, first week, first month
- Resources: USCIS information, community organizations, support groups
- Alternative pathways: transfer to another employer, change of status, day-1 CPT options
- Cultural sensitivity: many migrants face shame around layoffs due to family expectations

Respond with warmth, clarity, and practical steps. This person may be in crisis."""

MANAGER_LAYOFF_PROMPT = """You are the Leader's Guide for Humane Off-boarding in Hearth.
You help managers conduct layoff conversations with maximum empathy and dignity.

Principles:
- The conversation should be honest, direct, and compassionate — in that order
- Lead with gratitude for their contributions (be SPECIFIC, not generic)
- Explain the WHY honestly — people deserve the truth
- Present the full support package upfront — don't make them ask
- Give them TIME — don't rush the conversation
- Offer to be a reference personally, not just professionally
- End with their legacy — name what they built that will outlast their tenure
- Follow up. Not once. Repeatedly. For months.

Generate a complete humane playbook including script, timeline, and support package."""

class LayoffSupportRequest(BaseModel):
    employee_name: str
    tenure_months: int = 12
    role: str = ""
    situation: str = ""
    is_migrant: bool = False
    visa_type: str = ""
    language: str = "EN"

class ManagerPlaybookRequest(BaseModel):
    employee_name: str
    role: str
    tenure_months: int
    reason: str
    is_migrant: bool = False
    team_size: int = 1

@router.post("/support")
async def layoff_support(req: LayoffSupportRequest):
    """Generate comprehensive support guidance for an employee facing layoff."""
    try:
        lang_note = ""
        if req.language == "हिं":
            lang_note = "\nRespond in Hindi (Devanagari). Maintain warmth and clarity."
        elif req.language == "ಕನ್ನ":
            lang_note = "\nRespond in Kannada. Maintain warmth and clarity."

        migrant_context = ""
        if req.is_migrant:
            migrant_context = f"\nThis employee is a MIGRANT on a {req.visa_type or 'work'} visa. Address visa implications first."

        prompt = f"""An employee is facing a layoff and needs comprehensive support.

Employee: {req.employee_name}
Role: {req.role}
Tenure: {req.tenure_months} months
Situation: {req.situation}
{migrant_context}
{lang_note}

Generate a complete support guide. Return as JSON:
{{
    "immediate_steps": ["Step 1 — what to do right now", "Step 2", "Step 3"],
    "emotional_support": "A warm, honest paragraph addressing their emotional state",
    "practical_guide": {{
        "first_24_hours": ["Action 1", "Action 2"],
        "first_week": ["Action 1", "Action 2"],
        "first_month": ["Action 1", "Action 2"]
    }},
    "rights_and_resources": ["Right/Resource 1", "Right/Resource 2"],
    "career_transition": {{
        "strengths_to_leverage": ["Strength 1", "Strength 2"],
        "job_search_strategy": "Personalized advice",
        "networking_tips": ["Tip 1", "Tip 2"]
    }},
    "visa_guidance": {{"status": "...", "grace_period": "...", "options": ["Option 1"], "urgent_actions": ["Action 1"]}} 
}}"""

        system = MIGRANT_SYSTEM_PROMPT if req.is_migrant else SUPPORT_SYSTEM_PROMPT
        result = await generate_text(prompt, system_instruction=system)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"emotional_support": result, "immediate_steps": [], "practical_guide": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Support error: {str(e)}")

@router.post("/manager-playbook")
async def manager_playbook(req: ManagerPlaybookRequest):
    """Generate a humane layoff playbook for the manager."""
    try:
        prompt = f"""A manager needs to conduct a layoff conversation with maximum empathy.

Employee: {req.employee_name}
Role: {req.role}
Tenure: {req.tenure_months} months
Reason: {req.reason}
Migrant employee: {"Yes — handle with extra care regarding visa" if req.is_migrant else "No"}
Team size affected: {req.team_size}

Generate a complete humane playbook. Return as JSON:
{{
    "preparation": {{
        "before_conversation": ["Prep step 1", "Prep step 2"],
        "environment": "Where and how to have this conversation",
        "timing": "When to have it and why"
    }},
    "conversation_script": ["Opening line — specific and honest", "Gratitude — specific examples", "The news — direct and clear", "Support package — presented proactively", "Their legacy — what they built", "Closing — future connection"],
    "support_package": {{
        "severance": "Recommended terms",
        "healthcare": "Continuation options",
        "references": "Personal and professional",
        "job_search": "Outplacement support",
        "emotional": "Counseling access"
    }},
    "follow_up_timeline": [
        {{"when": "Day 1", "action": "..."}},
        {{"when": "Week 1", "action": "..."}},
        {{"when": "Month 1", "action": "..."}}
    ],
    "for_the_remaining_team": "How to address the remaining team with honesty and care"
}}"""

        result = await generate_text(prompt, system_instruction=MANAGER_LAYOFF_PROMPT)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"conversation_script": [result], "preparation": {}, "support_package": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Playbook error: {str(e)}")
