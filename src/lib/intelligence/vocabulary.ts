export function calculateVocabularyRichness(words: string[]) {
  const totalWords = words.length;
  if (totalWords === 0) return { vocabularyRichness: 0, uniqueWordsCount: 0 };
  
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))).size;
  const vocabularyRichness = Math.round((uniqueWords / totalWords) * 100);
  
  return { vocabularyRichness, uniqueWordsCount: uniqueWords };
}
