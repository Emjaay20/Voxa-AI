export function calculateConfidence(wordsPerMinute: number, totalWords: number, fillerWordsCount: number) {
  let confidence = 100;
  
  const fillerDensity = totalWords > 0 ? (fillerWordsCount / totalWords) * 100 : 0;
  confidence -= (fillerDensity * 3); // Penalty for fillers
  
  // Penalize pacing extremes
  if (wordsPerMinute < 100) {
    confidence -= (100 - wordsPerMinute) * 0.5;
  } else if (wordsPerMinute > 180) {
    confidence -= (wordsPerMinute - 180) * 0.5;
  }
  
  return {
    speakingConfidence: Math.max(0, Math.min(100, Math.round(confidence)))
  };
}
