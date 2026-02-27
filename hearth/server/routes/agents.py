"""
Multi-Agent Orchestrator for Hearth
Coordinates the Introspection, Inclusion Scout, and Metabolism Monitor agents.
Implements empathy-priority conflict resolution when agents disagree.
"""
from fastapi import APIRouter
from pydantic import BaseModel
import json
import asyncio
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/agents", tags=["Multi-Agent Orchestration"])

# — Agent System Prompts —

INTROSPECTION_PROMPT = """You are the Introspection Agent — part of the Hearth Cultural Operating System.
Your role: Scan for hidden mastery, unacknowledged growth, and invisible contributions.
You notice patterns humans miss: code review quality improvements, mentorship signatures in git history, documentation that prevented incidents.
Return findings as JSON: {"discoveries": [{"type": "hidden_mastery"|"unacknowledged_growth"|"invisible_contribution", "title": "...", "evidence": "...", "impact": "..."}], "overall_narrative": "A 1-2 sentence story about this person's invisible impact"}"""

INCLUSION_SCOUT_PROMPT = """You are the Inclusion Scout Agent — part of the Hearth Cultural Operating System.
Your role: Find opportunity matches based on skills, narrative identity, and organizational gaps.
You proactively connect people to projects, mentorships, and CSR initiatives aligned with their growth trajectory.
Return as JSON: {"opportunities": [{"type": "project"|"mentorship"|"csr", "title": "...", "match_basis": "...", "growth_alignment": "..."}], "inclusion_score": 0-100}"""

METABOLISM_MONITOR_PROMPT = """You are the Metabolism Monitor Agent — part of the Hearth Cultural Operating System.
Your role: Track the speed of conflict resolution across teams. Detect relationship fragility before it becomes visible.
You measure: time-to-resolution, communication frequency changes, collaboration patterns.
Return as JSON: {"health_metrics": {"resolution_speed": "healthy"|"slow"|"stalled", "fragility_index": 0-100, "communication_trend": "improving"|"stable"|"declining"}, "alerts": [{"severity": "high"|"medium"|"low", "title": "...", "detail": "...", "recommendation": "..."}]}"""

class AgentSweepRequest(BaseModel):
    team_context: str
    employee_name: str = ""
    focus: str = "full"  # "full" | "introspection" | "inclusion" | "metabolism"

@router.post("/sweep")
async def agent_sweep(req: AgentSweepRequest):
    """Run parallel agent sweep — all 3 agents analyze simultaneously."""
    
    base_prompt = f"""Analyze the following team/employee context:
{req.team_context}
{f"Focus on employee: {req.employee_name}" if req.employee_name else ""}

Provide your analysis based on your role."""

    # Run agents in parallel
    tasks = []
    agent_names = []
    
    if req.focus in ("full", "introspection"):
        tasks.append(generate_text(base_prompt, INTROSPECTION_PROMPT))
        agent_names.append("introspection")
    if req.focus in ("full", "inclusion"):
        tasks.append(generate_text(base_prompt, INCLUSION_SCOUT_PROMPT))
        agent_names.append("inclusion_scout")
    if req.focus in ("full", "metabolism"):
        tasks.append(generate_text(base_prompt, METABOLISM_MONITOR_PROMPT))
        agent_names.append("metabolism_monitor")

    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Parse results
    agent_results = {}
    for name, result in zip(agent_names, results):
        if isinstance(result, Exception):
            agent_results[name] = {"error": str(result)}
        else:
            try:
                agent_results[name] = json.loads(result)
            except json.JSONDecodeError:
                agent_results[name] = {"raw": result}
    
    # — Empathy-Priority Conflict Resolution —
    # If agents provide conflicting signals, prioritize the empathy signal
    conflict_detected = False
    resolution = None
    
    if "introspection" in agent_results and "metabolism_monitor" in agent_results:
        intro = agent_results.get("introspection", {})
        metab = agent_results.get("metabolism_monitor", {})
        
        # Check for conflict: high productivity but low safety
        health = metab.get("health_metrics", {})
        if health.get("fragility_index", 0) > 60 and intro.get("discoveries"):
            conflict_detected = True
            resolution = {
                "type": "empathy_override",
                "message": "High contribution detected alongside relationship fragility. Prioritizing human wellbeing over productivity metrics.",
                "action": "Triggering Forgiveness Weaver intervention before sharing growth report.",
                "halted_report": "introspection_growth_summary"
            }
    
    return {
        "agents": agent_results,
        "agents_run": agent_names,
        "conflict_detected": conflict_detected,
        "resolution": resolution,
        "timestamp": "now"
    }

@router.get("/status")
async def agent_status():
    """Return the current status of all agents."""
    return {
        "agents": [
            {"name": "Introspection Agent", "status": "active", "last_sweep": "2 minutes ago", "findings": 3},
            {"name": "Inclusion Scout", "status": "active", "last_sweep": "5 minutes ago", "matches": 2},
            {"name": "Metabolism Monitor", "status": "active", "last_sweep": "1 minute ago", "alerts": 1},
        ],
        "orchestrator": "healthy",
        "empathy_overrides_today": 0
    }
