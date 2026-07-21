import { calculateSpeechPacing, calculateSentenceMetrics } from "./speech";
import { calculateVocabularyRichness } from "./vocabulary";
import { calculateFluency } from "./fluency";
import { calculateConfidence } from "./confidence";

export interface SpeechMetrics {
  wordsPerMinute: number;
  fillerWordsCount: number;
  fillerWords: { word: string; count: number }[];
  averageSentenceLength: number;
  vocabularyRichness: number;
  speakingConfidence: number;
  longestPause: number;
  totalSpeakingTime: number;
}

export function calculateSpeechMetrics(transcript: string, durationSeconds: number): SpeechMetrics {
  const words = transcript.trim().split(/\s+/);
  
  const { wordsPerMinute, totalWords } = calculateSpeechPacing(words, durationSeconds);
  const { averageSentenceLength, sentenceCount } = calculateSentenceMetrics(transcript, totalWords);
  const { vocabularyRichness } = calculateVocabularyRichness(words);
  const { fillerWordsCount, fillerWords, longestPause } = calculateFluency(transcript, sentenceCount);
  const { speakingConfidence } = calculateConfidence(wordsPerMinute, totalWords, fillerWordsCount);

  return {
    wordsPerMinute,
    fillerWordsCount,
    fillerWords,
    averageSentenceLength,
    vocabularyRichness,
    speakingConfidence,
    longestPause,
    totalSpeakingTime: durationSeconds
  };
}
