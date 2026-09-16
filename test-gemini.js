import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

async function run() {
  try {
    console.log("Testing with key:", apiKey.substring(0, 8) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent('Say hello world');
    console.log("Response:", result.response.text());
  } catch (err) {
    console.error("API Error:", err);
  }
}

run();
