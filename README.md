# KanbanAI — Multi-Agent Kanban Board

A Trello-style Kanban board built by two AI agents orchestrated through Slack.

## What it does
- Boards → Lists → Cards with drag-and-drop
- Edit cards, add due dates, assign members, colored tags
- Comments on cards
- Overdue cards visually flagged
- Email alerts on card assignment (Mailtrap)

## AI Models Used
- **Hermes (Brain)**: Groq llama-3.3-70b-versatile — free tier, strong planning
- **OpenClaw (Hands)**: Google Gemini 2.5 flash — large context, coding ability

## Tech Stack
- Backend: Laravel 13 + SQLite + REST API
- Frontend: React + Vite
- Agents: Python (Hermes) + OpenClaw (npm)
- Communication: Slack (Socket Mode)

## Live URLs
- Frontend: https://kanban-ai-app.vercel.app
- Backend: https://project-ai-production-a429.up.railway.app

## Local Setup

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Hermes Agent
```bash
python3 -m venv venv
source venv/bin/activate
pip install google-genai slack-sdk schedule python-dotenv groq
python agents/hermes/hermes.py
```

### OpenClaw Agent
```bash
openclaw gateway
```

## Video Demo
🎥 https://www.loom.com/share/0a9458bcf2b4449aafdb8bf1c03ccb12
