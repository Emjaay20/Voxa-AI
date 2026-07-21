const OpenAI = require("openai");
const client = new OpenAI({ apiKey: "test" });
console.log("Has chat:", !!client.chat);
console.log("Has chat.completions:", !!(client.chat && client.chat.completions));
console.log("Has chat.completions.parse:", !!(client.chat && client.chat.completions && client.chat.completions.parse));
console.log("Has beta:", !!client.beta);
console.log("Has beta.chat:", !!(client.beta && client.beta.chat));
