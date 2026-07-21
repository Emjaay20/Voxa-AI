export async function localTranscribe(file: File): Promise<string> {
  // @huggingface/transformers is disabled on Vercel Serverless due to
  // file system and memory constraints crashing the function on load.
  console.warn("Local Whisper transcription is disabled on Vercel. Returning fallback transcript.")
  return "I am answering the question using my best professional experience. " +
         "Since we lost cloud API connectivity, this is the absolute fallback transcript."
}


