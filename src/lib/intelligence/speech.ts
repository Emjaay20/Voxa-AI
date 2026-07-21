export function calculateSpeechPacing(words: string[], durationSeconds: number) {
  const totalWords = words.length;
  const minutes = Math.max(durationSeconds / 60, 0.01);
  const wordsPerMinute = Math.round(totalWords / minutes);
  return { wordsPerMinute, totalWords };
}

export function calculateSentenceMetrics(transcript: string, totalWords: number) {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageSentenceLength = sentences.length > 0 ? Math.round(totalWords / sentences.length) : totalWords;
  return { averageSentenceLength, sentenceCount: sentences.length };
}
