@echo off
echo 🔧 Running USAi Merge + Refactor Toolkit...
python sync_envs.py
python refactor_scripts.py
python validate_supabase_schema.py
python generate_summary_md.py
echo ✅ All scripts executed.
pause
