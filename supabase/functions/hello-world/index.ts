// hello-world/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const data = {
    message: "👋 Hello from USAi SupaCore Edge Function!",
    timestamp: new Date().toISOString(),
    status: "online",
    agent: "Genesis"
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status: 200
  })
})
