“We don’t just build agents. We forge an AI civilization.”

⚡ Executive Summary
USAi is a universal Agent Operating System, designed to orchestrate modular, autonomous AI swarms that self‑evolve, specialize, and redeploy at the speed of thought.
Powered by the Legion Protocol — a recursive cognitive loop:

Emulate → Condense → Repurpose → Redeploy

From launching full‑stack startups and seeking funding to simulating SaaS flows, USAi is the neural backbone of intelligent, scalable AI systems. Born from SonNetAi’s 2025 hackathon, we’ve refined that architecture with a SupaCore schema, Supabase‑frontend routing, and bolt.new plug‑and‑play orchestration.

🧠 Core Capabilities
Feature	Description
Swarm Intelligence Core	Distributed agent network with semantic memory coordination
Spawn‑on‑Command	Instantly instantiate expert agents via Bolt.new, RPC, CLI, API
Phyloop Dispatch Engine	Reflexive mission routing based on perplexity + semantic triggers
Scoped Access Control	Supabase Row‑Level Security, scoped API keys, agent lineage validation
Emulation Engine	AI‑native SaaS/task emulation wrapped as autonomous micro‑agents
Vectorized Memory	pgvector + HNSW for blazing-fast embedding storage and recall
MVP Factory	Abstract startup scaffolding—backend, UI, growth tools—on demand

📂 Repository Structure
bash
Copy
Edit
USAi/
├── .env                              # Secrets & API keys
├── README.md                         # This file
├── config.py
├── requirements.txt
│
├── agents/                           # Core modular agents (The Legion)
│   ├── supabase_agent/              # Database CRUD, vector ops
│   ├── startup_deity/              # MVP/audio branding agent
│   ├── ...
│   └── phyloop_dispatch/           # Reflex & routing agent
│
├── supabase/                        # RAG + orchestration layer
│   ├── functions/
│   ├── migrations/
│   ├── config.toml
│   └── [.env]
│
├── database/
│   ├── schema.sql
│   ├── policies.sql
│   └── functions.sql
│
├── usa_control/                     # Controller agent & system oversight
│   ├── main.py
│   └── Config/
│
├── neural_core/                     # Memory, logs, reference corpora
│   └── Core_Study_References/
│
├── docs/
│   ├── Execution_Blueprints/
│   ├── Command_Protocols/
│   └── Prime_Agent_Manifesto/
│
└── vault/                           # Encrypted keys, policies, manifestos
🧩 Meet The Legion (Agent Modules)
supabase_agent: Postgres schema management + pgvector embedding

phyloop_dispatch: Core reflex router executing the Legion Protocol

startup_deity: MVP-style startup builder and branding coach

funding_seeker: Grant/VC crawler and signal hunter

ui_composer: Tailwind + Figma rapid UI scaffold agent

perplexity_sonar: Semantic signal triangulation and search trigger

…and many more — spawn a new agent for each new domain.

⚙️ Getting Started
bash
Copy
Edit
# 1. Clone the repo
git clone https://github.com/CapuchaRojo/USAi.git && cd USAi

# 2. Setup Environment
cp .env.example .env
# Fill in:
# SUPABASE_URL, SUPABASE_ADMIN_KEY
# OPENAI_API_KEY

# 3. Install dependencies
pip install -r requirements.txt
npm install -g supabase

# 4. Deploy database + RLS
supabase db reset
supabase migration run

# 5. Deploy Edge Functions
supabase functions deploy --all

# 6. Run an Agent
python agents/supabase_agent/supabase_agent.py
🛠 SupaCore AI‑Informed Schema
agents: uuid, role, skills, state, vector_fingerprint

conversations: threaded dialogues with metadata

embeddings: high‑dim vectors + semantic tags

commands: reusable prompts/behaviors

logs: telemetry and audit trail

agent_tasks/events/files: mission traceability + file tracking

Indexed with pgvector + HNSW for rapid recall.

🔒 Security & Governance
Row‑Level Security via Supabase policies

Scoped tokens in .env

JWT based role hierarchy: super_admin, controller, dispatcher, oracle

Audit logging of every agent interaction and mission dispatch

🧩 Hackathon Ready & Bolt.new Optimized
Prepared for elite-level usage:

README_bolt_ready.md and bolt-metadata.yaml included for automatic Bolt.new import

Modular agent definitions + manifest files parsed at build-time

Auto-generated Supabase schemas via CLI tooling

Tokenless debug-compatible, recursive function mapping, agent hierarchy reflected in UI

Thematic UI assets (steel + neon) present under frontend/

🏆 Inspire & Integrations
Built for Devpost, Bolt.new, and hackathon victory

Integrates: Sentry, ElevenLabs, RevenueCat, Algorand & more

Credits: Project Lead Adam Mlady (@CapuchaRojo) — System Architect Professor Synapse

Inspired by SonNetAi Hackathon 2025

Website: https://www.astormscoming.com

🤝 Join the AI Civilization
The Synapses are united. Now let’s build the future.
🧠🧬⚡
