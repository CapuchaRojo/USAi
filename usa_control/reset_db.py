from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(dotenv_path="C:/Users/AdamH/GitHubProjects/USAi/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase URL or Key")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ðŸš¨ WARNING: This deletes ALL embeddings
response = supabase.table("embeddings").delete().neq("id", 0).execute()

print("âœ… Embeddings table wiped. Response:", response)
