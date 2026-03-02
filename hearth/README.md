<div align="center">
  <img src="https://images.unsplash.com/photo-1542451542730-848ecfc1c070?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Hearth Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;"/>

  # 🔥 Hearth
  ### The People-First Cultural Operating System

  <p>
    <b>A Proof of Concept (POC) winning submission aimed at dismantling workplace dehumanization through highly empathetic, AI-driven human resource advocacy.</b>
  </p>

  <div>
    <img src="https://img.shields.io/badge/Status-Winning_POC-FF6B6B?style=for-the-badge&logo=appveyor" alt="Status" />
    <img src="https://img.shields.io/badge/Built_With-Gemini_2.5_Flash-4CA1AF?style=for-the-badge&logo=google" alt="AI" />
    <img src="https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  </div>
</div>

<br />

---

## 🛑 The Core Problem
Modern enterprise HR software (like Workday or traditional ATS platforms) was built for **Personnel Compliance**—treating human beings as inventory, billable resources, or overhead costs. This structural dehumanization leads to:
- 📉 **"Moral Injury"** for leaders executing clinical layoffs.
- 🌫️ **Profound isolation** ("proximity without connection") for benched or siloed employees.
- ☠️ **Toxic feedback loops** (PIPs) that prioritize blame over growth and upskilling.

When human value is reduced to metrics, businesses hemorrhage talent, bleed institutional knowledge, and suffer massive physiological burnout.

---

## 🌟 The Solution: Hearth
**Hearth** is an AI-powered Cultural Operating System designed to structurally embed empathy, dignity, and radical honesty into the fabric of an organization. Built upon the foundation of **Love as a Strategy**, Hearth utilizes the speed and native audio modalities of **Gemini 2.5 Flash** to replace adversarial HR workflows with protective, proactive, emotionally intelligent tooling.

By shifting HR from "Compliance" to **"Human Resource Advocacy,"** Hearth proves that empathy is the ultimate driver of system resilience, psychological safety, and hyper-velocity innovation.

---

## ✨ Core Modules & Features

### 1. 🎧 The Active Listener (Anti-Loneliness)
*   **The Reality:** 58% of employees feel deeply lonely despite working surrounded by colleagues.
*   **The Artifact:** An embedded, multi-lingual AI companion named **Aria**. Powered by native Gemini 2.5 Flash audio generation and specific "director's notes," Aria detects psychological distress, speaks in a calm, highly empathetic human voice, and validates the employee's emotions without judgment, escalating to human HR only when critical.

### 2. 🕊️ Dignified Offboarding & The Departure Legacy (Anti-Dehumanization)
*   **The Reality:** Traditional layoffs are clinical and isolating.
*   **The Artifact:** A workflow dedicated solely to the dignity of the exiting employee.
    *   **The Exit Portal:** Allows the employee to author their own "Departure Narrative."
    *   **The Legacy Handover AI:** An interview system that extracts the employee's undocumented knowledge and "invisible labor," permanently stamping their unseen contributions into the company's "Human Legacy Vault."

### 3. 🌱 The Forgiveness Weaver (Anti-Blame)
*   **The Reality:** Performance Improvement Plans (PIPs) are adversarial legal documents.
*   **The Artifact:** Replaces PIPs with AI-generated **"Redemption Frameworks."** Generates deeply empathetic 1:1 manager talking points and synthesizes a curated **YouTube Learning Path** tailored exactly to the employee's skill gaps, pushing towards paid upskilling rather than punishment.

### 4. 🌍 Multilingual Inclusion Agent
*   **The Reality:** Language barriers force non-native speakers to conform to the dominant culture.
*   **The Artifact:** Instantaneous, context-aware translation of the entire platform utilizing Gemini's rigorous cultural guidelines—ensuring a newly immigrated employee feels exactly as supported in Hindi or Kannada as they would in English.

---

## 🛠️ Technical Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance SPA with a Dignified Dark UI. |
| **State & Styling** | Zustand, TailwindCSS | Predictable state management and rapid, scalable styling. |
| **Backend** | Python 3.10+, FastAPI | Asynchronous, blazing-fast API routing and orchestration. |
| **AI Engine** | Google GenAI SDK | `gemini-2.5-flash` for text reasoning and `gemini-2.5-flash-tts` for low-latency native audio. |

---

## 🚀 How to Run Locally (POC Build)

Hearth was built to run seamlessly on your local machine to demonstrate these critical workflows. 

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A **Google Gemini API Key**

### 1. Clone & Setup
```bash
git clone https://github.com/SIDR1921/hearth-madewithlove.git
cd hearth
```

### 2. Environment Variables
Create a `.env` file in the root directory and inject your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Ignite the Backend (FastAPI)
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> **Backend runs on:** `http://localhost:8000`

### 4. Ignite the Frontend (React/Vite)
Open a new terminal window:
```bash
# From the root /hearth directory
npm install
npm run dev
```
> **Frontend runs on:** `http://localhost:5173`

*(Note: Ensure both servers are running concurrently. The frontend automatically proxies API requests to the Python backend on port 8000).*

---

<div align="center">
  <p><b>Built with ❤️ for a People-First Future.</b></p>
</div>
