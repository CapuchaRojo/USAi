import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    "SUPABASE_URL": os.getenv("SUPABASE_URL"),
    "SUPABASE_KEY": os.getenv("SUPABASE_KEY"),
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "DEFAULT_USER_ID": os.getenv("DEFAULT_USER_ID", "anon"),
    "DEBUG": os.getenv("DEBUG_MODE", "true").lower() == "true",
}
