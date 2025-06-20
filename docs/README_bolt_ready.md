# USAi: United Synapses of AI
**Universal Agent Operating System**

---

## 🧠 Project Type
```yaml
projectType: "AI Orchestrator"


integrations:
  - Supabase
  - Stripe
  - OpenAI
  - n8n
  - FastAPI


features:
  - Edge Functions
  - Real-time SQL
  - Vector Memory (pgvector)
  - Agent Autonomy
  - Role Switching
  - RLS Security Protocols


src/
├── Root Execution Layer/
│   └── Oracle/                  ← Predictive Foresight Agent
├── legion/                     ← Modular Agent Layer
├── the_Catalyst/
│   └── DISPATCHER_01/          ← Swarm Task Router
├── usa_control/                ← System Controller Agent
├── kernel/                     ← Agent Loader + Core Runtime
├── neural_core/                ← Memory, Logs, Study Layer


Emulate → Condense → Repurpose → Redeploy


| Table           | Description                                    |
| --------------- | ---------------------------------------------- |
| `agents`        | All autonomous units with roles, skills, state |
| `embeddings`    | Vectorized knowledge chunks (pgvector)         |
| `conversations` | Threaded dialogues with metadata               |
| `commands`      | Abstracted prompts/scripts                     |
| `logs`          | System + telemetry audit trails                |


| Function          | Purpose                           |
| ----------------- | --------------------------------- |
| `agent-webhook`   | Entry point for external triggers |
| `run-agent-task`  | Starts missions for agents        |
| `save-vector`     | Stores vectorized knowledge       |
| `query-knowledge` | Searches vector DB                |
| `heartbeat`       | Swarm telemetry & uptime check    |


deployment:
  - Vercel
  - Docker
  - Supabase (CLI)

Use supabase functions deploy --all

Use supabase start for local dev with pgvector

🎨 UI + UX Style Guide
Theme: Machine-Polished Steel

Accents: Neon Pink (Action), Electric Blue (Info)

Design Language: RTS/StarCraft-inspired control panel

Layout: Modular, Signal-Driven, Multi-Agent Display

🔐 Security Protocols
Row-Level Security: Enabled

JWT-based Role Auth (super_admin, controller, dispatcher, oracle)

API keys required for Edge Function access

S3 uploads expire after 60m

/supacore-usai/
├── supabase/
│   ├── functions/
│   ├── migrations/
│   ├── config.toml
│   └── .env.example
├── README_bolt_ready.md ← This file
├── docs/
│   ├── bolt-metadata.yaml
│   └── Execution_Blueprints/


🧪 Optional Additions (Post-Hackathon Phase II)
FastAPI Agent Router

LangChain plugin hooks

Visual Vector Dashboard

Custom GPT Plugin integration

USAi isn't just a system. It's a swarm-powered revolution.


