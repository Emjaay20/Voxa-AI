const FILLER_WORDS = [
  { word: "um", pattern: "u+m+" },
  { word: "uh", pattern: "u+h+" },
  { word: "like", pattern: "like" },
  { word: "actually", pattern: "actually" },
  { word: "basically", pattern: "basically" },
  { word: "you know", pattern: "you know" },
  { word: "right", pattern: "right" },
  { word: "so yeah", pattern: "so yeah" },
  { word: "i mean", pattern: "i mean" }
];

export function calculateFluency(transcript: string, sentenceCount: number) {
  const lowerTranscript = transcript.toLowerCase();
  let totalFillerCount = 0;
  const fillerWordStats: { word: string; count: number }[] = [];

  FILLER_WORDS.forEach(({ word, pattern }) => {
    // This regex catches drawn out versions like "uhhhh" or "ummmm"
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    if (matches && matches.length > 0) {
      totalFillerCount += matches.length;
      fillerWordStats.push({ word, count: matches.length });
    }
  });

  // Longest pause heuristic based on punctuation density and fillers
  const fillerDensity = transcript.length > 0 ? (totalFillerCount / transcript.split(/\s+/).length) * 100 : 0;
  const maxPause = Math.max(1.2, Math.min(3.5, 1.2 + (sentenceCount * 0.1) + (fillerDensity * 0.05)));

  return {
    fillerWordsCount: totalFillerCount,
    fillerWords: fillerWordStats.sort((a, b) => b.count - a.count),
    longestPause: Number(maxPause.toFixed(1))
  };
}
