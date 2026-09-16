import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getGeminiInsight } from '@/lib/geminiClient';
import ReactMarkdown from 'react-markdown';

export const BAAnalystChat = () => {
  const { chatHistory, addChatMessage, businessContext, datasetSummary, kpis } = useBAStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Accepts an optional direct message so suggestion chips work correctly
  // (React setState is async — calling handleSend right after setInput would
  //  read the stale empty string instead of the new value)
  const handleSend = async (directMsg?: string) => {
    const userMsg = (directMsg ?? input).trim();
    if (!userMsg) return;

    if (!directMsg) setInput('');
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    });

    setIsTyping(true);

    try {
      const prompt = `
        You are a Senior Business Analyst & Data Analyst AI Copilot. 
        Context:
        Industry: ${businessContext?.industry}
        Primary Goal: ${businessContext?.primaryGoal}
        Dataset columns: ${datasetSummary?.columns.map(c => c.name).join(', ')}
        Top KPIs: ${JSON.stringify(kpis.map(k => ({ title: k.title, value: k.currentValue, trend: k.trend })))}
        
        Recent chat history:
        ${chatHistory.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}
        
        User question: "${userMsg}"
        
        Answer professionally, concisely, and format with markdown. If analyzing data, explain your reasoning.
      `;
      
      const response = await getGeminiInsight(prompt);
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Chat error', error);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error trying to analyze that. Please try again.',
        timestamp: new Date()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-[#E2E2E0] flex items-center">
            <Bot className="w-6 h-6 mr-2 text-teal-600" />
            AI Analyst Copilot
          </h2>
          <p className="text-[#E2E2E0]/70 text-sm mt-1">
            Your personal Senior Business Analyst, ready to answer questions about your data.
          </p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-[#2B7574]/30 shadow-sm bg-[#12484C] overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0E2931]/50">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-[#12484C] border border-[#2B7574]/30 text-[#E2E2E0] rounded-tl-sm shadow-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                  <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-[#E2E2E0]/60'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-[#12484C] border border-[#2B7574]/30 rounded-tl-sm shadow-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="p-4 bg-[#12484C] border-t border-[#2B7574]/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-2 items-center"
          >
            <Input 
              placeholder="Ask about revenue trends, operational bottlenecks, or specific KPIs..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-full border-[#2B7574]/40 focus-visible:ring-teal-500 bg-[#0E2931]"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-teal-600 hover:bg-teal-700 text-white shrink-0 shadow-md"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-semibold text-[#E2E2E0]/70 py-1.5 px-2">Try asking:</span>
        {[
          "What is causing our highest delays?",
          "How can we improve our primary goal?",
          "Summarize the recent KPI trends."
        ].map(suggestion => (
          <button
            key={suggestion}
            className="text-xs px-3 py-1.5 bg-[rgba(14,41,49,0.8)] hover:bg-[rgba(14,41,49,0.9)] text-[#E2E2E0]/80 rounded-full transition-colors border border-[#2B7574]/30"
            onClick={() => handleSend(suggestion)}
            disabled={isTyping}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
