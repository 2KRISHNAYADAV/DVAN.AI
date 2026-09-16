import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const fallbackKey = 'AQ.Ab8RN6JIXjKPvnYpaxWGDtITGy4qeaJ4X-IFcqeoGigadyRnwQ';
  
  const keyToUse = envKey || fallbackKey;
  return new GoogleGenerativeAI(keyToUse);
};

export const getGeminiInsight = async (prompt: string): Promise<string> => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Client Error:', error);
    return 'I apologize, but I am unable to generate AI insights at the moment. Please try again later or check your API key configuration.';
  }
};

export const generateUniversalProfile = async (summary: any, sampleData: any[]): Promise<any> => {
  try {
    const prompt = `
      You are an expert Data Scientist. Analyze the following dataset metadata and sample data.
      I need you to generate a deep, universal dataset profile.
      
      Dataset Summary (columns, types, missing values):
      ${JSON.stringify(summary)}
      
      Sample Data (first 3 rows):
      ${JSON.stringify(sampleData)}
      
      Return ONLY a strict JSON object with the following structure (no markdown formatting, no code blocks):
      {
        "domain": "e.g., Healthcare, Sales, IoT, NLP, Scientific",
        "summary": "2 sentence explanation of what this dataset is",
        "metrics": ["list", "of", "important", "numeric", "columns"],
        "dimensions": ["list", "of", "important", "categorical", "columns"],
        "recommendedAnalysis": ["list of 3-5 specific analysis paths e.g. Customer Segmentation, Churn Prediction"]
      }
    `;

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Profile Error:", error);
    return null;
  }
};
