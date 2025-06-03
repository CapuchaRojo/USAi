import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Optional default values
DEFAULT_USER_ID = os.getenv("DEFAULT_USER_ID", "anonymous")
DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"

if DEBUG_MODE:
    print("[DEBUG] Config loaded. Supabase URL:", SUPABASE_URL)