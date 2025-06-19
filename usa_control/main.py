import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client

# Load environment variables
load_dotenv(dotenv_path="C:/Users/AdamH/GitHubProjects/USAi/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not OPENAI_API_KEY:
    raise ValueError("Missing one or more required environment variables.")

# Initialize clients
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client = OpenAI(api_key=OPENAI_API_KEY)

# FastAPI app
app = FastAPI()

# Request schema
class EmbedRequest(BaseModel):
    agent_id: str
    content: str

# /embed endpoint
@app.post("/embed")
def embed_content(req: EmbedRequest):
    try:
        embedding = client.embeddings.create(
            model="text-embedding-ada-002",
            input=req.content
        ).data[0].embedding

        response = supabase.table("embeddings").insert({
            "agent_id": req.agent_id,
            "content": req.content,
            "embedding": embedding
        }).execute()

        return {"status": "success", "id": response.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
