import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the environment variable
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = request.body;

    if (!prompt) {
      return response.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.VITE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
      return response.status(500).json({ error: 'API key not configured in environment variables' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return response.status(200).json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return response.status(500).json({ error: error.message || 'Internal server error' });
  }
}
