import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiMiddleware = (env: Record<string, string>) => ({
  name: 'gemini-api-middleware',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/gemini' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => body += chunk.toString());
        req.on('end', async () => {
          try {
            const { prompt } = JSON.parse(body);
            const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';
            if (!apiKey) throw new Error("API key not found");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      mode === 'development' && geminiApiMiddleware(env)
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
