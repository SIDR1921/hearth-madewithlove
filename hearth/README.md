# Hearth: The People-First Cultural Operating System

## The Problem
Modern enterprise HR software (like Workday or traditional ATS platforms) was built for "Personnel Compliance"—treating human beings as inventory, billable resources, or overhead costs. This structural dehumanization leads to massive, invisible friction: "Moral Injury" for leaders executing clinical layoffs, profound isolation ("proximity without connection") for benched employees, and toxic feedback loops (PIPs) that prioritize blame over growth. 

When human value is reduced to metrics, businesses hemorrhage talent, bleed institutional knowledge, and suffer physiological burnout. 

## The Solution: Hearth
Hearth is an AI-powered Cultural Operating System designed to structurally embed empathy, dignity, and radical honesty into the fabric of an organization. Built on Softway’s 6 Pillars of a People-First Culture (Inclusion, Forgiveness, Love, Vulnerability, Empowerment, Honesty), Hearth weaponizes Gemini 2.5 Flash to replace adversarial HR workflows with protective, proactive, emotionally intelligent tooling.

By shifting HR from "Compliance" to "Human Resource Advocacy," Hearth proves that Love as a Strategy isn't just a corporate buzzword—it is the ultimate driver of system resilience, psychological safety, and hyper-velocity innovation.

---

## Core Modules & Features

### 1. The Active Listener (Anti-Loneliness)
*   **The Problem:** 58% of employees feel deeply lonely despite working surrounded by colleagues.
*   **The Feature:** An embedded, multi-lingual AI companion (Aria). Powered by native Gemini 2.5 Flash audio generation and specific "director's notes," Aria detects psychological distress, speaks in a calm, highly empathetic human voice, and validates the employee's emotions. It provides immediate, judgment-free support and escalates to human resources if crisis is detected.

### 2. Dignified Offboarding & The Departure Legacy (Anti-Dehumanization)
*   **The Problem:** Traditional layoffs are clinical, isolating, and leave deep "moral injuries" on both leaders and survivors.
*   **The Feature:** A workflow dedicated solely to the dignity of the exiting employee.
    *   **The Exit Portal:** Allows the exiting employee to author their own "Departure Narrative," giving them control over how their story is told to the team.
    *   **The Legacy Handover AI:** An interview system that extracts the employee's undocumented knowledge and "invisible labor," permanently stamping their unwritten contributions into the company's "Human Legacy Vault."

### 3. The Forgiveness Weaver (Anti-Blame)
*   **The Problem:** Performance Improvement Plans (PIPs) are adversarial legal documents designed to defend the company, not help the employee.
*   **The Feature:** Replaces PIPs with AI-generated "Redemption Frameworks."
    *   Generates highly empathetic, radically honest 1:1 manager talking points.
    *   Uses Gemini to synthesize a curated, 4-week **YouTube Learning Path** tailored exactly to the employee's skill gaps and learning style, shifting the focus from punishment to paid upskilling.

### 4. Impact & Identity Portraits (Anti-Personnel Metrics)
*   **The Problem:** Performance is often graded on superficial Jira velocity or lines of code, punishing the "invisible labor" of mentorship and clean architecture.
*   **The Feature:** The "GitHub MCP" Scanner. It deeply analyzes an employee's public/internal commit history to generate a massive, narrative "Identity Portrait." It highlights hidden mastery (e.g., "The Architectural Steward") and translates their code contributions directly into UN Sustainable Development Goals (SDG 8 metrics).

### 5. Multilingual Inclusion Agent
*   **The Problem:** Language barriers create systemic exclusion for non-native speakers, forcing them to conform to the dominant culture.
*   **The Feature:** Deep integration of Gemini's translation capabilities wrapped in rigorous cultural guidelines. It translates the entire platform—maintaining tone, empathy, formatting, and structural dignity—ensuring a newly immigrated employee feels exactly as supported in Hindi or Kannada as they would in English.

---

## Technical Stack
*   **Frontend:** React 18, Vite, TailwindCSS (Dark/Dignified UI), Zustand, React Router DOM, Lucide Icons.
*   **Backend:** FastAPI (Python 3.10+), Uvicorn.
*   **AI Engine:** Google GenAI SDK (`gemini-2.5-flash`), Native Audio Modalities (`gemini-2.5-flash-tts`).

---

## Proof of Concept (POC) Submission

**Hearth** was developed as a winning Proof of Concept. This repository contains the submission build, demonstrating the core viability of our AI-powered Cultural Operating System. The current implementation showcases the primary workflows (The Active Listener, Dignified Offboarding, The Forgiveness Weaver, and Multilingual Inclusion) using the Gemini 2.5 Flash API for both text inference and low-latency native audio generation.

---

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/SIDR1921/hearth-madewithlove.git
cd hearth
```

### 2. Setup the Data Environment
Create a `.env` file in the root directory and add your API credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Backend (FastAPI)
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*The backend runs on `http://localhost:8000`.*

### 4. Start the Frontend (React/Vite)
Open a new terminal window:
```bash
# From the root directory
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

> [!NOTE]
> Make sure both servers are running simultaneously for the application to function correctly. The frontend proxies API requests to the Python backend.
