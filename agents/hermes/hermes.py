import os
import json
import schedule
import time
import threading
from datetime import datetime
from dotenv import load_dotenv
from groq import Groq
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_MAIN = os.getenv("SLACK_CHANNEL_MAIN", "project-main")
SLACK_LOG = os.getenv("SLACK_CHANNEL_LOG", "agent-log")

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "memory.json")

# set up gemini client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# slack client
slack = WebClient(token=SLACK_BOT_TOKEN)


# ---------- memory ----------

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {"facts": [], "plans": []}
    with open(MEMORY_FILE) as f:
        return json.load(f)


def save_memory(data):
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=2)


def store_fact(text):
    mem = load_memory()
    mem["facts"].append({"text": text, "saved_at": datetime.now().isoformat()})
    save_memory(mem)


def store_plan(goal, plan_text):
    mem = load_memory()
    mem["plans"].append({"goal": goal, "plan": plan_text, "saved_at": datetime.now().isoformat()})
    save_memory(mem)


# ---------- slack ----------

def post(channel, msg):
    try:
        slack.chat_postMessage(channel=channel, text=msg)
    except SlackApiError as e:
        print(f"[slack error] {e.response['error']}")


# ---------- llm ----------

def ask(prompt):
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return resp.choices[0].message.content


# ---------- skills ----------

def status_report():
    mem = load_memory()
    facts = "\n".join(f["text"] for f in mem["facts"][-5:]) or "nothing yet"
    plans = "\n".join(f"{p['goal']}: {p['plan'][:100]}..." for p in mem["plans"][-3:]) or "none"
    return ask(f"""You are Hermes, an AI project orchestrator.
Write a short status update with exactly these three sections:

**What I Did**
**What's Left**
**What Needs Your Call**

Facts: {facts}
Plans: {plans}

2-3 bullets per section max.""")


def plan_goal(goal):
    mem = load_memory()
    context = "\n".join(f["text"] for f in mem["facts"][-5:]) or "none"
    plan = ask(f"""You are Hermes, AI planning agent for a software project.
Break this into concrete numbered steps for a coding agent:

Goal: {goal}
Context: {context}

Be specific. Think like a tech lead.""")
    store_plan(goal, plan)
    return plan


def chat(message):
    mem = load_memory()
    context = "\n".join(f["text"] for f in mem["facts"][-3:]) or "none"
    return ask(f"""You are Hermes, AI orchestrator for a Kanban app project.
Memory: {context}
User: {message}
Reply helpfully and concisely.""")


# ---------- cron ----------

def autonomous_ping():
    mem = load_memory()
    now = datetime.now().strftime("%H:%M")
    msg = (
        f"🤖 *Hermes check-in* [{now}]\n"
        f"• Facts stored: {len(mem['facts'])}\n"
        f"• Plans made: {len(mem['plans'])}\n"
        f"• Status: running normally"
    )
    post(SLACK_LOG, msg)
    print(f"[{now}] pinged #{SLACK_LOG}")


# ---------- router ----------

def handle(text):
    t = text.lower().strip()
    if any(w in t for w in ["remember", "store this", "note that"]):
        store_fact(text)
        return "got it, stored ✅"
    if any(w in t for w in ["recall", "what do you know", "what do you remember"]):
        mem = load_memory()
        facts = mem.get("facts", [])
        if not facts:
            return "nothing in memory yet"
        return "here's what i have:\n" + "\n".join(f"• {f['text']}" for f in facts[-10:])
    if any(w in t for w in ["status", "report", "update"]):
        return status_report()
    if any(w in t for w in ["plan", "build", "create", "make", "scaffold"]):
        return f"here's the plan:\n\n{plan_goal(text)}"
    return chat(text)


# ---------- main ----------

if __name__ == "__main__":
    print("hermes starting up...")
    post(SLACK_MAIN, "🧠 *Hermes online.* Ready to plan and orchestrate.")

    schedule.every(10).minutes.do(autonomous_ping)

    def scheduler_loop():
        while True:
            schedule.run_pending()
            time.sleep(1)

    threading.Thread(target=scheduler_loop, daemon=True).start()
    print("cron running — ping every 10 min")
    print("ready. type to chat (ctrl+c to quit)\n")

    while True:
        try:
            user = input("you: ").strip()
            if not user:
                continue
            reply = handle(user)
            print(f"\nhermes: {reply}\n")
            post(SLACK_LOG, f"*hermes:* {reply}")
        except KeyboardInterrupt:
            print("\nhermes shutting down. bye")
            break
