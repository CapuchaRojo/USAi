from supabase import create_client, Client

supabase: Client = None

def init(config):
    global supabase
    print("    ↳ Connecting to Supabase...")
    supabase = create_client(config["SUPABASE_URL"], config["SUPABASE_KEY"])
    print("    ↳ Connection established.")