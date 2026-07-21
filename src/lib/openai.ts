import OpenAI from "openai"

// This assumes you have OPENAI_API_KEY in your .env.local
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
