"""
GitHub/Jira Profile Analyzer — scans public GitHub data and synthesizes
a "Strengths Portrait" for the employee's manager using Gemini.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import httpx
from ..gemini_client import generate_text

router = APIRouter(prefix="/api/profile", tags=["Profile Analyzer"])

GITHUB_SYSTEM_PROMPT = """You are the Introspection Agent of Hearth — a People-First Cultural Operating System.
You analyze a developer's public GitHub presence to uncover HIDDEN STRENGTHS that traditional metrics miss.

What to look for:
- Mentorship signals: thoughtful code reviews, helping newcomers, documentation contributions
- Invisible labor: CI/CD maintenance, dependency updates, test coverage improvements
- Craft mastery: consistent quality patterns, architectural decisions, refactoring ownership
- Community building: discussions, issue triage, cross-repo contributions
- Growth trajectory: technologies adopted, complexity of recent work vs. older work

CRITICAL RULES:
- Frame EVERYTHING as a strength, never a weakness
- Provide an EXTREMELY DETAILED, in-depth analysis. Do not be brief. Write an extensive, multi-paragraph narrative for the portrait and hidden mastery.
- The `portrait` must be highly analytical yet deeply empathetic, describing their exact coding style, architecture choices, and cultural impact over at least 3 detailed paragraphs.
- Use warm, human language — this goes to their manager as an exhaustive portrait of who they ARE
- Highlight things the employee might not even recognize in themselves
- Generate a "Narrative Identity" — a human title like "The Silent Architect" or "The Bridge Builder"

Return ONLY raw JSON with NO markdown backticks:
{
  "narrative_identity": "A creative title capturing their essence",
  "portrait": "An extremely detailed, 3-4 paragraph deep-dive into this person's invisible impact, coding philosophy, and value to a team.",
  "strengths": [
    {"category": "Mentorship", "title": "...", "evidence": "Detailed proof from their repos", "impact": "How this transforms the team"}
  ],
  "growth_trajectory": "A detailed paragraph on where their skills are inevitably leading them.",
  "manager_talking_points": ["Deep, specific point 1 for 1:1 conversation", "Deep point 2", "Deep point 3"],
  "hidden_mastery": "A massive, eye-opening paragraph exposing a high-level architectural or social skill they possess but likely undervalue."
}"""

JIRA_SYSTEM_PROMPT = """You are the Work Pattern Analyzer of Hearth — a People-First Cultural Operating System.
You analyze work activity patterns to uncover strengths and working style insights.

What to analyze:
- Sprint patterns: consistency, commitment accuracy, scope management
- Collaboration: cross-team work, unblocking others, pair programming signals
- Initiative: self-assigned tasks, process improvements, technical debt reduction
- Communication: issue descriptions, documentation quality, stakeholder updates
- Resilience: performance during crunch days, recovery patterns

Frame as STRENGTHS for their manager. Never surveillance. Always dignifying.

Return as JSON:
{
  "work_style": "Brief description of their working style",
  "strengths": [{"category": "...", "title": "...", "evidence": "..."}],
  "energy_pattern": "When they do their best work",
  "collaboration_signature": "How they uniquely contribute to team dynamics",
  "manager_insights": ["Insight 1", "Insight 2", "Insight 3"]
}"""

class GitHubRequest(BaseModel):
    username: str

class JiraRequest(BaseModel):
    employee_name: str
    activity_summary: str  # Free-text summary of work patterns

@router.post("/github")
async def analyze_github(req: GitHubRequest):
    """Fetch public GitHub data and generate a strengths portrait via Gemini."""
    try:
        # Fetch real GitHub data
        async with httpx.AsyncClient() as client:
            # User profile
            user_resp = await client.get(f"https://api.github.com/users/{req.username}", timeout=10)
            if user_resp.status_code != 200:
                raise HTTPException(status_code=404, detail=f"GitHub user '{req.username}' not found")
            user_data = user_resp.json()

            # Repos
            repos_resp = await client.get(
                f"https://api.github.com/users/{req.username}/repos?sort=updated&per_page=15",
                timeout=10
            )
            repos = repos_resp.json() if repos_resp.status_code == 200 else []

            # Recent events
            events_resp = await client.get(
                f"https://api.github.com/users/{req.username}/events?per_page=30",
                timeout=10
            )
            events = events_resp.json() if events_resp.status_code == 200 else []

        # Build context for Gemini
        repo_summary = []
        for r in repos[:15]:
            repo_summary.append(f"- {r.get('name')}: {r.get('description', 'No description')} "
                              f"({r.get('language', 'Unknown')} | ⭐ {r.get('stargazers_count', 0)} | "
                              f"Forks: {r.get('forks_count', 0)})")

        event_types = {}
        for e in events:
            t = e.get('type', 'Unknown')
            event_types[t] = event_types.get(t, 0) + 1

        github_context = f"""
GitHub Profile: {user_data.get('name', req.username)} (@{req.username})
Bio: {user_data.get('bio', 'None')}
Company: {user_data.get('company', 'Not listed')}
Location: {user_data.get('location', 'Not listed')}
Public Repos: {user_data.get('public_repos', 0)}
Followers: {user_data.get('followers', 0)} | Following: {user_data.get('following', 0)}
Account Created: {user_data.get('created_at', 'Unknown')}

Top Repositories:
{chr(10).join(repo_summary)}

Recent Activity (last 30 events):
{json.dumps(event_types, indent=2)}
"""

        result = await generate_text(
            f"Analyze this GitHub profile and generate a strengths portrait:\n\n{github_context}",
            system_instruction=GITHUB_SYSTEM_PROMPT
        )

        try:
            parsed = json.loads(result)
            parsed["github_data"] = {
                "avatar_url": user_data.get("avatar_url"),
                "name": user_data.get("name"),
                "username": req.username,
                "public_repos": user_data.get("public_repos"),
                "followers": user_data.get("followers"),
            }
            return parsed
        except json.JSONDecodeError:
            return {"portrait": result, "narrative_identity": "Contributor", "strengths": [], "github_data": {"username": req.username}}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@router.post("/jira")
async def analyze_jira(req: JiraRequest):
    """Analyze Jira-like work patterns and generate strengths via Gemini."""
    try:
        prompt = f"""Analyze these work patterns for {req.employee_name}:

{req.activity_summary}

Generate a strengths portrait based on their work patterns."""

        result = await generate_text(prompt, system_instruction=JIRA_SYSTEM_PROMPT)
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return {"work_style": result, "strengths": [], "manager_insights": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Jira analysis error: {str(e)}")
