#!/bin/bash

# Define source and target
LEGACY="/c/Users/AdamH/USAi"
TARGET="/c/Users/AdamH/GitHubProjects/USAi"

# Create structure
mkdir -p "$TARGET/vault"
mkdir -p "$TARGET/docs/Prime_Agent_Manifesto"
mkdir -p "$TARGET/docs/Foresight_Network"
mkdir -p "$TARGET/docs/Command_Protocols"
mkdir -p "$TARGET/docs/Execution_Blueprints"
mkdir -p "$TARGET/usa_control"
mkdir -p "$TARGET/neural_core"
mkdir -p "$TARGET/archives"

# Copy data
rsync -av --exclude 'venv/' "$LEGACY/Vault/" "$TARGET/vault/"
cp -r "$LEGACY/Prime_Agent_Manifesto/"* "$TARGET/docs/Prime_Agent_Manifesto/"
cp -r "$LEGACY/Foresight_Network/"* "$TARGET/docs/Foresight_Network/"
cp -r "$LEGACY/Command_Protocols/"* "$TARGET/docs/Command_Protocols/"
cp -r "$LEGACY/Execution_Blueprints/"* "$TARGET/docs/Execution_Blueprints/"
cp -r "$LEGACY/USA_Control/"* "$TARGET/usa_control/"
cp -r "$LEGACY/Neural_Core/"* "$TARGET/neural_core/"
cp -r "$LEGACY/src/"* "$TARGET/src/"
cp "$LEGACY/usaix_bolt_ready.zip" "$TARGET/archives/"

echo "✅ Legacy migration complete."
