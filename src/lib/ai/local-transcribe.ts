export async function localTranscribe(file: File): Promise<string> {
  void file
  throw new Error(
    "Local transcription is unavailable. Configure GROQ_API_KEY or OPENAI_API_KEY."
  )
}
