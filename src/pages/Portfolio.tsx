import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { ExternalLink, Github, Linkedin, Mail, ArrowRight, Sparkles } from 'lucide-react';

const Portfolio = () => {
  // Auto-redirect after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      window.open('https://er-krishna-yadav.vercel.app/', '_blank', 'noopener,noreferrer');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E2931] flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="max-w-xl w-full text-center space-y-8">
          {/* Animated logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#2B7574] flex items-center justify-center shadow-[0_0_40px_-8px_rgba(43,117,116,0.7)] animate-pulse">
              <Sparkles className="w-10 h-10 text-[#E2E2E0]" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-[#E2E2E0] tracking-tight">Krishna Yadav</h1>
            <p className="text-[#E2E2E0]/60 text-lg">AI & Data Engineering · Full Stack Developer</p>
          </div>

          <div className="bg-[#12484C] rounded-2xl border border-[rgba(43,117,116,0.25)] p-6 text-left space-y-4">
            <p className="text-[#E2E2E0]/80 text-sm leading-relaxed">
              Creator of <strong className="text-teal-400">DVAN.AI</strong> — an enterprise-grade, no-code AI analytics platform, and <strong className="text-teal-400">DATSH.AI</strong> — a data exploration tool. Passionate about making data intelligence accessible to everyone.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { label: 'DVAN.AI', href: '/', icon: <Sparkles className="w-4 h-4" /> },
                { label: 'DATSH.AI', href: 'https://datshdattashodhini.vercel.app/', icon: <ExternalLink className="w-4 h-4" />, external: true },
              ].map((p) => (
                p.external ? (
                  <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(43,117,116,0.15)] border border-[rgba(43,117,116,0.3)] text-[#E2E2E0] text-sm font-medium hover:bg-[rgba(43,117,116,0.3)] transition-all">
                    {p.icon} {p.label}
                  </a>
                ) : (
                  <a key={p.label} href={p.href}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(43,117,116,0.15)] border border-[rgba(43,117,116,0.3)] text-[#E2E2E0] text-sm font-medium hover:bg-[rgba(43,117,116,0.3)] transition-all">
                    {p.icon} {p.label}
                  </a>
                )
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {[
              { href: 'https://github.com/2KRISHNAYADAV', icon: <Github className="w-5 h-5" />, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/krishna-yadav-392b61300', icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
              { href: 'mailto:darya780945@gmail.com', icon: <Mail className="w-5 h-5" />, label: 'Email' },
            ].map((s) => (
              <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-[#12484C] border border-[rgba(43,117,116,0.25)] flex items-center justify-center text-[#E2E2E0]/70 hover:text-[#E2E2E0] hover:bg-teal-600 hover:border-teal-600 transition-all"
                title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>

          <a
            href="https://er-krishna-yadav.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl shadow-[0_8px_24px_-8px_rgba(43,117,116,0.6)] hover:scale-[1.03] transition-all text-sm"
          >
            Visit Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </a>

          <p className="text-[#E2E2E0]/30 text-xs">Opening portfolio in a new tab shortly…</p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
