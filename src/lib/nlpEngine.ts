// Simple local NLP engine for DVAN.AI

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'best', 'better',
  'love', 'happy', 'satisfied', 'perfect', 'beautiful', 'awesome', 'positive', 'success',
  'glad', 'impressed', 'recommend', 'nice', 'smooth', 'easy', 'fast', 'quick'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'worst', 'terrible', 'awful', 'horrible', 'poor', 'slow', 'hard', 'difficult',
  'hate', 'disappointed', 'unhappy', 'frustrated', 'annoying', 'negative', 'fail',
  'broken', 'useless', 'expensive', 'waste', 'error', 'bug', 'issue', 'problem'
]);

export const validateTextColumn = (data: any[], column: string): { isValid: boolean, message: string } => {
  if (!data || data.length === 0 || !column) {
    return { isValid: false, message: "No data available." };
  }

  let validTextCount = 0;
  let totalLength = 0;
  const uniqueValues = new Set();
  let booleanCount = 0;
  let numberCount = 0;

  for (let i = 0; i < Math.min(data.length, 500); i++) {
    const val = data[i][column];
    if (val === null || val === undefined || val === '') continue;
    
    const strVal = String(val).trim();
    const lowerVal = strVal.toLowerCase();

    uniqueValues.add(strVal);
    
    if (lowerVal === 'true' || lowerVal === 'false' || lowerVal === 'yes' || lowerVal === 'no' || lowerVal === '1' || lowerVal === '0') {
      booleanCount++;
    } else if (!isNaN(Number(strVal))) {
      numberCount++;
    } else {
      validTextCount++;
      totalLength += strVal.length;
    }
  }

  const sampleSize = Math.min(data.length, 500);
  
  if (booleanCount > sampleSize * 0.5) {
    return { isValid: false, message: "Column appears to contain boolean values (Yes/No, True/False)." };
  }
  
  if (numberCount > sampleSize * 0.5) {
    return { isValid: false, message: "Column appears to contain mostly numbers/IDs." };
  }

  if (validTextCount === 0) {
    return { isValid: false, message: "No text found in this column." };
  }

  const avgLength = totalLength / validTextCount;
  
  // If average length is very short, it's likely a category (e.g. "Male", "Female", "NY")
  if (avgLength < 12) {
    return { isValid: false, message: "Text is too short on average. Likely categorical data, not natural language." };
  }

  // If there are very few unique values compared to the dataset size (categories like "New York")
  const uniqueRatio = uniqueValues.size / validTextCount;
  if (uniqueRatio < 0.05 && validTextCount > 50) {
     return { isValid: false, message: "Column has very few unique values. Likely categorical data." };
  }

  return { isValid: true, message: "Valid text column detected." };
};

export const cleanAndTokenize = (text: string): string[] => {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

export const extractKeywords = (texts: string[], topK: number = 10) => {
  const frequency: Record<string, number> = {};
  
  texts.forEach(text => {
    if (!text) return;
    const tokens = cleanAndTokenize(text);
    tokens.forEach(token => {
      frequency[token] = (frequency[token] || 0) + 1;
    });
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([word, count]) => ({ word, count }));
    
  return sorted;
};

export const analyzeSentimentLocal = (texts: string[]) => {
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  const positiveWordsFound: Record<string, number> = {};
  const negativeWordsFound: Record<string, number> = {};

  texts.forEach(text => {
    if (!text) return;
    const tokens = cleanAndTokenize(text);
    
    let posCount = 0;
    let negCount = 0;

    tokens.forEach(token => {
      if (POSITIVE_WORDS.has(token)) {
        posCount++;
        positiveWordsFound[token] = (positiveWordsFound[token] || 0) + 1;
      }
      if (NEGATIVE_WORDS.has(token)) {
        negCount++;
        negativeWordsFound[token] = (negativeWordsFound[token] || 0) + 1;
      }
    });

    if (posCount > negCount) positive++;
    else if (negCount > posCount) negative++;
    else neutral++;
  });

  const total = positive + negative + neutral || 1; // avoid div by 0

  const topPos = Object.entries(positiveWordsFound).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]);
  const topNeg = Object.entries(negativeWordsFound).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]);

  return {
    distribution: [
      { name: 'Positive', value: Math.round((positive / total) * 100), raw: positive },
      { name: 'Neutral', value: Math.round((neutral / total) * 100), raw: neutral },
      { name: 'Negative', value: Math.round((negative / total) * 100), raw: negative }
    ],
    topPositiveWords: topPos,
    topNegativeWords: topNeg
  };
};

export const extractTopicsLocal = (texts: string[]) => {
  // A simplistic local topic modeling approach: cluster highly frequent keywords
  const keywords = extractKeywords(texts, 20);
  
  // Group into 3 pseudo-topics for demo purposes based on random assignment for now
  // In a real local pipeline, we might use term co-occurrence
  const topics = [
    { name: 'Topic 1', keywords: keywords.slice(0, 5).map(k => k.word) },
    { name: 'Topic 2', keywords: keywords.slice(5, 10).map(k => k.word) },
    { name: 'Topic 3', keywords: keywords.slice(10, 15).map(k => k.word) }
  ];

  return topics.filter(t => t.keywords.length > 0);
};
