const API_BASE = 'http://localhost:8000/api';

async function apiFetch(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'API request failed');
    }
    return await res.json();
}

// Active Listener (Aria)
export async function askListener(message, language = 'EN', context = '', history = []) {
    return apiFetch('/listener/respond', { message, language, context, conversation_history: history });
}

// Coaching Scripts
export async function getCoachingScript(situation, employeeName, language = 'EN', context = '') {
    return apiFetch('/coaching/script', { situation, employee_name: employeeName, language, context });
}

// Opportunity Forge
export async function forgeMatch(employeeName, skills, narrativeIdentity = '', orgGaps = '') {
    return apiFetch('/forge/match', { employee_name: employeeName, skills, narrative_identity: narrativeIdentity, org_gaps: orgGaps });
}

// Translation
export async function translateText(text, targetLanguage) {
    const res = await apiFetch('/translate', { text, target_language: targetLanguage });
    return res.translated_text;
}

// GitHub Profile Analyzer
export async function analyzeGitHub(username) {
    return apiFetch('/profile/github', { username });
}

// ─── NEW AGENTIC APIs ───────────────────

// Learning Path (YouTube)
export async function getLearningPath(employeeName, role, skillGaps = [], coachingContext = '', interests = '') {
    return apiFetch('/coaching/learning-path', { employee_name: employeeName, role, skill_gaps: skillGaps, coaching_context: coachingContext, interests });
}

// ─── SERVICE VANGUARD APIs ────────────────

// Next-Role Radar (Bench Upskilling)
export async function generateServiceRadar(employeeName, currentSkills, upcomingProject, projectRequirements) {
    return apiFetch('/service/radar', { employee_name: employeeName, current_skills: currentSkills, upcoming_project: upcomingProject, project_requirements: projectRequirements });
}

// ─── SENESCHAL INCUBATOR APIs ────────────────

// Generate Internal Innovation Project for Benched Employees
export async function generateIncubatorProject(employeeName, currentSkills) {
    return apiFetch('/incubator/generate-project', { employee_name: employeeName, current_skills: currentSkills });
}
