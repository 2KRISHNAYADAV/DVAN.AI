import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getGeminiInsight } from '@/lib/geminiClient';
import { DatasetSummary } from '@/lib/dataAnalysis';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboardStore } from '@/lib/store';

interface CopilotSidebarProps {
  summary: DatasetSummary | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const CopilotSidebar = ({ summary }: CopilotSidebarProps) => {
  const { aiProfile } = useDashboardStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am DVAN AI Copilot. I have analyzed your dataset structure. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseMarkdown = (text: string) => {
    // Basic bold and list parsing
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
    return { __html: html };
  };

  const handleSend = async () => {
    if (!input.trim() || !summary) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    const contextStr = JSON.stringify({
      ...summary,
      aiDetectedDomain: aiProfile?.domain,
      aiRecommendedAnalysis: aiProfile?.recommendedAnalysis,
    });

    const context = `
      You are a highly intelligent Data Scientist Copilot inside the DVAN.AI platform.
      The user has uploaded a dataset. Here is the metadata and AI profiling context:
      ${contextStr}
      
      The user is asking: "${userMsg}"
      
      Answer their question based on the actual dataset statistics and AI profile. Be highly concise, professional, and do not make up fake data. DO NOT use complex markdown tables or giant lists. Keep formatting simple.
    `;

    const aiResponse = await getGeminiInsight(context);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col border-purple-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl pb-4">
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          DVAN AI Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 ml-2' : 'bg-purple-100 mr-2'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div 
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0] rounded-tl-none'}`}
                    dangerouslySetInnerHTML={parseMarkdown(msg.content)}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-purple-100 mr-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-[rgba(14,41,49,0.8)] text-[#E2E2E0] rounded-tl-none flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-[#0E2931] rounded-b-xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full space-x-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask about your data..." 
            className="flex-1 bg-[#12484C]"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
