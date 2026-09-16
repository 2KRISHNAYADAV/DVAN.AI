import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import {
  Brain,
  Database,
  Code2,
  Sparkles,
  GraduationCap,
  MessageSquare,
  BarChart2,
  BrainCircuit,
  LineChart,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Mail,
  CheckCircle2,
  Award,
  Cpu,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   Scroll-reveal utility
───────────────────────────────────────────────────────────────── */
const FadeUp = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Animated canvas background (data-node network)
───────────────────────────────────────────────────────────────── */
const NetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 36;
    interface Node { x: number; y: number; vx: number; vy: number; r: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1.5,
    }));

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(109,40,217,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(109,40,217,0.25)';
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ─────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────── */
const skills = [
  { label: 'React / TypeScript', cat: 'Frontend' },
  { label: 'Tailwind CSS', cat: 'Frontend' },
  { label: 'Vite / Next.js', cat: 'Frontend' },
  { label: 'Node.js / Express', cat: 'Backend' },
  { label: 'Python / FastAPI', cat: 'Backend' },
  { label: 'Supabase / PostgreSQL', cat: 'Database' },
  { label: 'Machine Learning', cat: 'AI / Data' },
  { label: 'NLP Pipelines', cat: 'AI / Data' },
  { label: 'Data Visualization', cat: 'AI / Data' },
  { label: 'Google Gemini AI', cat: 'AI / Data' },
  { label: 'Random Forest / ML.js', cat: 'AI / Data' },
  { label: 'Vercel / Cloud Deploy', cat: 'Infra' },
];

const projects = [
  {
    name: 'DVAN.AI',
    badge: 'Current',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    accentBorder: 'border-t-purple-500',
    icon: <Sparkles className="w-4 h-4" />,
    iconBg: 'bg-purple-100 text-purple-700',
    desc: 'Universal AI Data Intelligence Platform with NLP workspace, ML Studio, AI Copilot, and dynamic AI-generated dashboards for any structured dataset.',
    link: null,
  },
  {
    name: 'DATSH.AI',
    badge: '2024',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    accentBorder: 'border-t-indigo-500',
    icon: <Database className="w-4 h-4" />,
    iconBg: 'bg-indigo-100 text-indigo-700',
    desc: 'Intelligent data preprocessing engine for cleaning, structuring, and preparing any dataset at scale — the backbone behind DVAN.AI.',
    link: 'https://datshdattashodhini.vercel.app/',
  },
  {
    name: 'Portfolio',
    badge: '2023',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    accentBorder: 'border-t-sky-500',
    icon: <Code2 className="w-4 h-4" />,
    iconBg: 'bg-sky-100 text-sky-700',
    desc: 'Modern personal portfolio showcasing projects, technical skills, and professional experience — built with React and Vite.',
    link: 'https://portfoliokrishna-ahir.vercel.app/',
  },
];

const timeline = [
  {
    year: '2023',
    icon: <Code2 className="w-4 h-4" />,
    color: 'bg-sky-100 text-sky-700',
    title: 'Started building data tools',
    detail: 'Began exploring interactive data analysis and built first dashboards using React and Recharts. Discovered my passion for combining AI with data.',
  },
  {
    year: '2024 Q1',
    icon: <Database className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700',
    title: 'Launched DATSH.AI',
    detail: 'Built a complete data preprocessing engine for structured datasets. Deployed on Vercel and used it as the foundation for future products.',
  },
  {
    year: '2024 Q3',
    icon: <BrainCircuit className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700',
    title: 'Built DVAN.AI',
    detail: 'Created a universal AI analytics platform merging NLP, ML model training, Gemini AI explanations, and a conversational copilot into a no-code workspace.',
  },
  {
    year: '2025+',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-700',
    title: 'Expanding AI capabilities',
    detail: 'Working on real-time data streams, multi-model AI routing, collaborative analysis sessions, and enterprise-grade data governance features.',
  },
];

const values = [
  { icon: <Brain className="w-5 h-5" />, bg: 'bg-purple-100 text-purple-700', title: 'Innovation First', desc: 'Continuously pushing boundaries in data science and AI to create tools that genuinely solve real problems.' },
  { icon: <GraduationCap className="w-5 h-5" />, bg: 'bg-indigo-100 text-indigo-700', title: 'Democratised Access', desc: 'Making advanced analytics accessible to students, researchers, and businesses — without code or data science degrees.' },
  { icon: <Award className="w-5 h-5" />, bg: 'bg-emerald-100 text-emerald-700', title: 'Engineering Excellence', desc: 'Obsessive attention to UI/UX, code quality, and system reliability in every product I build.' },
];

const capabilities = [
  { icon: <BarChart2 className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-50', title: 'AI Dashboards', sub: 'Auto-generated charts' },
  { icon: <BrainCircuit className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50', title: 'ML Studio', sub: 'Train models locally' },
  { icon: <MessageSquare className="w-4 h-4 text-sky-600" />, bg: 'bg-sky-50', title: 'NLP Engine', sub: 'Text intelligence' },
  { icon: <Sparkles className="w-4 h-4 text-orange-600" />, bg: 'bg-orange-50', title: 'AI Copilot', sub: 'Chat with data' },
];

/* ─────────────────────────────────────────────────────────────────
   Page Component
───────────────────────────────────────────────────────────────── */
const About = () => {
  return (
    <div className="min-h-screen bg-[#fcfbfe] font-sans antialiased">
      <Navigation />

      {/* ══════════════════════════════════════
          HERO — Dark charcoal background
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#18181b] text-white pt-24 pb-36">
        <div className="absolute inset-0 opacity-10">
          <NetworkCanvas />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider uppercase mb-2 animate-[fadeUp_0.6s_ease_out]">
            ABOUT US
          </h1>
          <p className="text-[#E2E2E0]/60 text-sm tracking-widest uppercase animate-[fadeUp_0.7s_ease_out]">
            A little about us & DVAN.AI
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OVERLAPPING CARD SECTION
      ══════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        <FadeUp>
          <div className="bg-[#12484C] rounded-3xl shadow-xl border border-[#2B7574]/20 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Biography & Intro */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E2E2E0] border-l-4 border-purple-600 pl-4">
                  Democratizing Advanced Analytics
                </h2>
                
                <p className="text-[#E2E2E0]/80 leading-relaxed text-sm">
                  Most analytics platforms are either too complex for business users or too simplistic to surface meaningful insight. DVAN.AI was designed to bridge this divide. It provides an intuitive, conversational, and visual interface built to transform raw spreadsheets into production-grade intelligence.
                </p>

                {/* Accent quote block */}
                <div className="pl-5 border-l-2 border-indigo-400 my-6 bg-indigo-50/30 py-3 pr-3 rounded-r-xl">
                  <p className="italic text-[#E2E2E0] text-sm leading-relaxed">
                    "I design and build AI-powered data products that transform raw spreadsheets into executive-grade intelligence. Obsessed with making complex data science genuinely accessible to everyone — no code required."
                  </p>
                </div>

                <p className="text-[#E2E2E0]/80 leading-relaxed text-sm">
                  Whether you are a researcher, business leader, or developer, this workspace adapts dynamically to your dataset, providing natural language exploration, custom local machine learning modeling, and interactive dashboards instantly.
                </p>

                {/* Founder signature block */}
                <div className="flex flex-col items-end pt-4 pr-4">
                  <span className="font-serif italic text-2xl text-purple-700 font-semibold select-none">
                    Krishna Yadav
                  </span>
                  <span className="text-[11px] text-[#E2E2E0]/60 tracking-wider uppercase mt-1">
                    Founder, DVAN.AI
                  </span>
                </div>
              </div>

              {/* Right Column: Profile Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 blur-lg" />
                  <div className="relative rounded-2xl overflow-hidden border border-gray-150 shadow-lg bg-[#0E2931]">
                    <img
                      src="/krishna.jpg"
                      alt="Krishna Yadav — Founder"
                      className="w-full aspect-[3/4] object-cover object-center"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.src = '/lovable-uploads/logo.png';
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </FadeUp>

        {/* ══════════════════════════════════════
            FEATURES / CAPABILITIES GRID
        ══════════════════════════════════════ */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3 py-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 rounded-full uppercase tracking-widest">
                Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E2E2E0] leading-tight">
                Powerful modules for every workflow
              </h2>
              <p className="text-[#E2E2E0]/70 leading-relaxed text-sm">
                DVAN.AI combines visual discovery, automated data prep, machine learning, and AI chat into a single cohesive application layout.
              </p>
            </div>

            {/* Right Column 2x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'AI Dashboards', desc: 'Auto-generated chart layouts, predictive projections, and visual summary metrics.', iconColor: 'text-purple-600', bgColor: 'bg-purple-50' },
                { title: 'ML Studio', desc: 'Train local classification or regression models with automated feature sizing and target selection.', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
                { title: 'NLP Engine', desc: 'Convert natural queries directly into custom analytics transformations and cleanups.', iconColor: 'text-sky-600', bgColor: 'bg-sky-50' },
                { title: 'AI Copilot', desc: 'Context-aware conversational system that chats directly with the variables in your dataset.', iconColor: 'text-orange-600', bgColor: 'bg-orange-50' },
              ].map((c) => (
                <div key={c.title} className="p-6 bg-[#12484C] rounded-2xl border border-[#2B7574]/20 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${c.bgColor} ${c.iconColor}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#E2E2E0] text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-[#E2E2E0]/70 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            CALL TO ACTION BANNER
        ══════════════════════════════════════ */}
        <FadeUp>
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <NetworkCanvas />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold">
                Ready to transform your spreadsheets?
              </h3>
              <p className="text-purple-200 text-sm">
                Get started with DVAN.AI today. Experience self-serve data analytics, local modeling, and visual insights instantly.
              </p>
              <div className="pt-2">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#12484C] text-purple-900 rounded-xl font-bold text-sm hover:bg-[rgba(14,41,49,0.8)] shadow transition-all hover:scale-[1.02]"
                >
                  Launch App
                </a>
              </div>
            </div>
          </div>
        </FadeUp>



      </div>

      {/* ══════════════════════════════════════
          3-COLUMN DETAILED FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#12484C] border-t border-[#2B7574]/20 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          {/* Col 1: Platform Info */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="font-black text-purple-900 tracking-wider text-lg">DVAN.AI</h4>
            <p className="text-xs text-[#E2E2E0]/70 leading-relaxed max-w-sm">
              Universal AI Data Intelligence Platform designed to enable natural language workspace capabilities, custom local machine learning models, and automated reporting interfaces.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-bold text-[#E2E2E0] text-xs tracking-wider uppercase">NAVIGATION</h5>
            <ul className="space-y-2 text-xs text-[#E2E2E0]/70">
              <li><a href="/" className="hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-purple-600 transition-colors">About Us</a></li>
              <li><a href="https://portfoliokrishna-ahir.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">Portfolio</a></li>
            </ul>
          </div>

          {/* Col 3: Contact/Help */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="font-bold text-[#E2E2E0] text-xs tracking-wider uppercase">HOW CAN WE HELP YOU?</h5>
            <div className="space-y-2 text-xs text-[#E2E2E0]/70">
              <p>Email: <a href="mailto:darya780945@gmail.com" className="hover:text-purple-600 transition-colors">darya780945@gmail.com</a></p>
              <div className="flex gap-3 pt-2">
                <a href="https://github.com/2KRISHNAYADAV" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#0E2931] hover:bg-[rgba(14,41,49,0.8)] hover:text-purple-600 transition-colors"><Github className="w-4 h-4" /></a>
                <a href="https://www.linkedin.com/in/krishna-yadav-392b61300" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#0E2931] hover:bg-[rgba(14,41,49,0.8)] hover:text-purple-600 transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href="https://www.instagram.com/krishnayaduvansy58/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#0E2931] hover:bg-[rgba(14,41,49,0.8)] hover:text-purple-600 transition-colors"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Copyright Footer */}
        <div className="border-t border-gray-50 pt-8 text-center">
          <p className="text-[11px] text-[#E2E2E0]/60">
            © 2025 DVAN.AI — Crafted with precision by Krishna Yadav.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(1.5rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1.1); opacity: 0.2; }
          50%       { transform: scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default About;