# Architecture

## Brain: Hermes
- Python agent using Groq llama-3.3-70b-versatile
- Persistent memory stored in agents/hermes/memory.json
- Skill: status-report (What I Did / What's Left / What Needs Your Call)
- Cron: posts autonomous update to #agent-log every 10 minutes
- Decomposes goals into numbered steps before acting

## Hands: OpenClaw
- npm-based coding agent (openclaw@latest)
- Connects to Slack via Socket Mode
- Receives tasks in #agent-coder
- Writes and executes code, reports results back

## Human Role
- Defines goals in Slack
- Reviews and approves plans
- Corrects mistakes and makes design decisions

## Slack Channel Scheme
- #project-main — Hermes announcements and planning
- #agent-coder — OpenClaw receives and executes tasks
- #agent-log — Activity log and autonomous Hermes pings

## Model Routing
- Hermes → Groq llama-3.3-70b-versatile (planning, memory, fast)
- OpenClaw → Google Gemini 2.5 flash (code generation, large context)

## Workflow
Human (#project-main) → Hermes plans → OpenClaw codes (#agent-coder) → Human reviews
