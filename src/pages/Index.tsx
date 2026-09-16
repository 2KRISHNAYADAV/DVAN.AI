import React, { useState, useEffect, useRef, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';
import Dashboard from '@/components/dashboard/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardStore } from '@/lib/store';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Database,
  Sparkles,
  Mail,
  Instagram,
  Github,
  Linkedin,
  ArrowRight,
  BarChart2,
  MessageSquare,
  Lock,
  CheckCircle2,
  LineChart,
  ChevronRight,
  Upload,
  Layers,
  TrendingUp,
  FileBarChart2,
  Star,
  ExternalLink,
  Zap,
  Shield,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   Canvas Smoke Particle System
───────────────────────────────────────────────────────────────── */
const SmokeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      opacity: number;
      life: number;
      maxLife: number;
      color: string;
    }

    const particles: Particle[] = [];
    const COLORS = [
      'rgba(43,117,116,',
      'rgba(18,72,76,',
      'rgba(122,202,200,',
      'rgba(14,41,49,',
    ];

    const spawn = () => {
      const x = Math.random() * canvas.width;
      const y = canvas.height + 20;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        radius: Math.random() * 80 + 30,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 200 + 120,
        color,
      });
    };

    let frame = 0;
    let rafId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 6 === 0) spawn();
      frame++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.04;
        p.radius += 0.25;

        const progress = p.life / p.maxLife;
        // fade in then out
        p.opacity = progress < 0.2
          ? (progress / 0.2) * 0.35
          : progress > 0.7
          ? ((1 - progress) / 0.3) * 0.35
          : 0.35;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `${p.color}${p.opacity})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────
   3D Mouse-Tilt Card
───────────────────────────────────────────────────────────────── */
const Card3D = ({
  children,
  className = '',
  intensity = 12,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) scale(1.03)`;
    card.style.boxShadow = `${-dx * 20}px ${dy * 20}px 60px rgba(0,0,0,0.5), 0 0 60px -12px rgba(43,117,116,0.5)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    card.style.boxShadow = '';
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-500 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Project data for the 3D Showcase
───────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'dvan',
    name: 'DVAN.AI',
    tagline: 'AI Data Intelligence Platform',
    desc: 'Enterprise-grade, no-code analytics workspace. Upload any dataset and instantly get AI dashboards, NLP pipelines, ML models, and a conversational copilot.',
    href: '/',
    external: false,
    tags: ['AI/ML', 'NLP', 'Analytics', 'No-Code'],
    stars: 4.9,
    color: '#2B7574',
    glow: 'rgba(43,117,116,0.4)',
    icon: '🧠',
    status: 'Live',
    tech: ['React', 'TypeScript', 'Gemini AI', 'Recharts'],
  },
  {
    id: 'datsh',
    name: 'DATSH.AI',
    tagline: 'Data Shodhini Explorer',
    desc: 'Advanced data exploration and visualization platform with intelligent pattern detection, automated insights, and interactive charts for any dataset.',
    href: 'https://datshdattashodhini.vercel.app/',
    external: true,
    tags: ['Data Viz', 'Exploration', 'Charts'],
    stars: 4.7,
    color: '#7acac8',
    glow: 'rgba(122,202,200,0.35)',
    icon: '📊',
    status: 'Live',
    tech: ['React', 'Python', 'D3.js', 'FastAPI'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    tagline: 'Full-Stack AI Engineer',
    desc: 'Personal portfolio showcasing projects in AI, data engineering, full-stack development, and machine learning — built with modern web technologies.',
    href: 'https://portfoliokrishna-ahir.vercel.app/',
    external: true,
    tags: ['Full Stack', 'AI', 'Portfolio'],
    stars: 5.0,
    color: '#e07575',
    glow: 'rgba(224,117,117,0.35)',
    icon: '🚀',
    status: 'Live',
    tech: ['Next.js', 'Three.js', 'Framer Motion'],
  },
];

/* 3D Project Card */
const ProjectCard3D = ({ project, delay = 0 }: { project: typeof PROJECTS[0]; delay?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.04) translateZ(20px)`;
    card.style.boxShadow = `${-dx * 24}px ${dy * 24}px 80px rgba(0,0,0,0.6), 0 0 80px -12px ${project.glow}`;
    if (glow) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${px}% ${py}%, ${project.glow} 0%, transparent 65%)`;
      glow.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.boxShadow = '';
    }
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  const content = (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden bg-[#12484C] border border-[rgba(43,117,116,0.22)] p-6 h-full flex flex-col transition-all duration-500 ease-out cursor-pointer group holo-shimmer"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Glow overlay that follows cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0, zIndex: 0 }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />

      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {project.status}
        </span>
      </div>

      {/* Icon */}
      <div
        className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)`, border: `1px solid ${project.color}44` }}
      >
        {project.icon}
      </div>

      {/* Title */}
      <div className="relative z-10 mb-2">
        <h3 className="text-xl font-bold text-[#E2E2E0] group-hover:text-white transition-colors">{project.name}</h3>
        <p className="text-xs font-medium mt-0.5" style={{ color: project.color }}>{project.tagline}</p>
      </div>

      {/* Description */}
      <p className="relative z-10 text-sm text-[#E2E2E0]/60 leading-relaxed flex-1 mb-4">{project.desc}</p>

      {/* Tags */}
      <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(43,117,116,0.15)] border border-[rgba(43,117,116,0.2)] text-[#E2E2E0]/70">
            {tag}
          </span>
        ))}
      </div>

      {/* Tech stack */}
      <div className="relative z-10 flex flex-wrap gap-1 mb-5">
        {project.tech.map(t => (
          <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#E2E2E0]/40 border border-[rgba(43,117,116,0.1)]">{t}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[rgba(43,117,116,0.15)]">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3"
              style={{ color: i < Math.floor(project.stars) ? project.color : 'rgba(226,226,224,0.2)' }}
              fill={i < Math.floor(project.stars) ? project.color : 'none'}
            />
          ))}
          <span className="text-xs font-bold ml-1" style={{ color: project.color }}>{project.stars}</span>
        </div>
        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: project.color }}>
          View Project <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );

  return project.external ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {content}
    </a>
  ) : (
    <Link to={project.href} className="block h-full" style={{ animationDelay: `${delay}ms` }}>
      {content}
    </Link>
  );
};


/* ─────────────────────────────────────────────────────────────────
   Intersection-observer based fade-in utility
───────────────────────────────────────────────────────────────── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const FadeUp = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────────────────────────── */
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const { ref, visible } = useFadeIn();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────────────────────────────────────────────────────────
   Animated Built-in UI Mockup Slides — no image files needed
───────────────────────────────────────────────────────────────── */

/** Mini animated bar chart */
const MiniBar = ({ heights, colors }: { heights: number[]; colors: string[] }) => (
  <div className="flex items-end gap-[3px] h-full">
    {heights.map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-sm"
        style={{
          height: `${h}%`,
          background: colors[i % colors.length],
          animation: `float ${1.8 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

/** KPI stat tile */
const KpiTile = ({ label, value, delta, color }: { label: string; value: string; delta: string; color: string }) => (
  <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: 'rgba(14,41,49,0.7)', border: `1px solid ${color}33` }}>
    <p className="text-[9px] uppercase tracking-widest font-semibold text-[#E2E2E0]/50">{label}</p>
    <p className="text-lg font-extrabold" style={{ color }}>{value}</p>
    <p className="text-[9px] font-semibold" style={{ color: delta.startsWith('+') ? '#4ade80' : '#f87171' }}>{delta}</p>
  </div>
);

/** Slide 1 — AI Dashboard */
const SlideAIDashboard = () => {
  const bars1 = [45, 72, 58, 85, 63, 90, 78, 66, 88, 74, 95, 82];
  const bars2 = [30, 55, 40, 68, 50, 75, 60, 48, 72, 58, 80, 65];
  return (
    <div className="w-full h-full bg-[#0E2931] p-3 flex flex-col gap-2 overflow-hidden">
      {/* Top KPI row */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <KpiTile label="Revenue" value="$2.4M" delta="+18.2%" color="#2B7574" />
        <KpiTile label="Customers" value="14.8K" delta="+6.1%" color="#7acac8" />
        <KpiTile label="Conversion" value="8.4%" delta="+1.2%" color="#2B7574" />
        <KpiTile label="Churn Rate" value="2.1%" delta="-0.4%" color="#e07575" />
      </div>
      {/* Charts row */}
      <div className="flex-1 grid grid-cols-3 gap-2 min-h-0">
        {/* Bar chart */}
        <div className="col-span-2 rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
          <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest">Monthly Revenue Trend</p>
          <div className="flex-1 min-h-0 flex gap-1">
            <div className="flex flex-col justify-between text-[8px] text-[#E2E2E0]/30 py-1 pr-1">
              <span>$3M</span><span>$2M</span><span>$1M</span><span>$0</span>
            </div>
            <div className="flex-1">
              <MiniBar heights={bars1} colors={['#2B7574', '#7acac8']} />
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex items-center gap-1 text-[8px] text-[#E2E2E0]/50"><span className="w-2 h-2 rounded-sm bg-[#2B7574]"/>Revenue</span>
            <span className="flex items-center gap-1 text-[8px] text-[#E2E2E0]/50"><span className="w-2 h-2 rounded-sm bg-[#7acac8]"/>Target</span>
          </div>
        </div>
        {/* Donut chart */}
        <div className="rounded-xl p-3 flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
          <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest">Segments</p>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full animate-spin-slow" style={{ animationDuration: '20s' }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#2B7574" strokeWidth="5" strokeDasharray="52 36" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#7acac8" strokeWidth="5" strokeDasharray="22 66" strokeDashoffset="-52" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e07575" strokeWidth="5" strokeDasharray="14 74" strokeDashoffset="-74" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#E2E2E0]">74%</div>
          </div>
          <div className="space-y-0.5 w-full">
            {[['Enterprise','#2B7574','52%'],['SMB','#7acac8','22%'],['Consumer','#e07575','14%']].map(([l,c,v]) => (
              <div key={l as string} className="flex items-center justify-between text-[8px]">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: c as string }} /><span className="text-[#E2E2E0]/60">{l as string}</span></span>
                <span className="font-bold" style={{ color: c as string }}>{v as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom trend line */}
      <div className="shrink-0 rounded-xl p-2" style={{ background: 'rgba(18,72,76,0.4)', border: '1px solid rgba(43,117,116,0.15)' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[8px] font-bold text-[#E2E2E0]/60 uppercase tracking-widest">Live Activity</p>
          <span className="flex items-center gap-1 text-[8px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>
        </div>
        <div className="h-8 flex items-end gap-[2px]">
          <MiniBar heights={bars2} colors={['rgba(43,117,116,0.7)', 'rgba(122,202,200,0.5)']} />
        </div>
      </div>
    </div>
  );
};

/** Slide 2 — NLP Workspace */
const SlideNLP = () => {
  const sentiments = [
    { text: 'Great product, exceeded expectations!', score: 94, label: 'Positive' },
    { text: 'Delivery was slow but quality is good', score: 61, label: 'Neutral' },
    { text: 'Service needs improvement urgently', score: 28, label: 'Negative' },
    { text: 'Amazing support team, highly recommend', score: 91, label: 'Positive' },
    { text: 'Average experience, nothing special', score: 52, label: 'Neutral' },
  ];
  const keywords = ['revenue','growth','customer','satisfaction','product','delivery','quality','support','experience'];
  return (
    <div className="w-full h-full bg-[#0E2931] p-3 flex flex-col gap-2 overflow-hidden">
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        {/* Sentiment list */}
        <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
          <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest shrink-0">Sentiment Analysis</p>
          <div className="flex-1 overflow-hidden space-y-1.5">
            {sentiments.map((s, i) => (
              <div key={i} className="group" style={{ animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <p className="text-[8px] text-[#E2E2E0]/70 truncate mb-0.5">"{s.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[#0E2931]/80">
                    <div
                      className="h-1.5 rounded-full transition-all duration-1000"
                      style={{
                        width: `${s.score}%`,
                        background: s.score > 70 ? '#2B7574' : s.score > 45 ? '#7acac8' : '#e07575',
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold shrink-0" style={{ color: s.score > 70 ? '#4ade80' : s.score > 45 ? '#7acac8' : '#f87171' }}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Keyword cloud + topic */}
        <div className="flex flex-col gap-2">
          <div className="rounded-xl p-3 flex-1" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
            <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest mb-2">Top Keywords</p>
            <div className="flex flex-wrap gap-1">
              {keywords.map((k, i) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-full text-[8px] font-semibold"
                  style={{
                    background: `rgba(43,117,116,${0.15 + (i % 3) * 0.1})`,
                    color: '#7acac8',
                    border: '1px solid rgba(43,117,116,0.3)',
                    fontSize: `${8 + (keywords.length - i) * 0.5}px`,
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
            <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest mb-1.5">Sentiment Distribution</p>
            <div className="flex gap-1 h-8">
              {[['Positive','#2B7574',62],['Neutral','#7acac8',24],['Negative','#e07575',14]].map(([l,c,v]) => (
                <div key={l as string} className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-full flex-1 rounded-sm" style={{ background: c as string, opacity: 0.7, height: `${v as number}%` }} />
                  <span className="text-[7px] text-[#E2E2E0]/50">{v as number}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* AI summary box */}
      <div className="shrink-0 rounded-xl p-2.5" style={{ background: 'rgba(43,117,116,0.1)', border: '1px solid rgba(43,117,116,0.25)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3 h-3 text-[#7acac8]" />
          <span className="text-[9px] font-bold text-[#7acac8] uppercase tracking-widest">AI NLP Summary</span>
        </div>
        <p className="text-[9px] text-[#E2E2E0]/70 leading-relaxed">
          <span className="text-emerald-400 font-bold">62%</span> of reviews are positive. Main drivers: product quality and support responsiveness. 
          Action: address delivery speed concerns to improve neutral sentiment by ~15%.
        </p>
      </div>
    </div>
  );
};

/** Slide 3 — ML Studio */
const SlideMLStudio = () => {
  const featureImportance = [
    { name: 'Revenue Growth', val: 87 },
    { name: 'Customer LTV', val: 73 },
    { name: 'Churn Signals', val: 68 },
    { name: 'Engagement Score', val: 61 },
    { name: 'Product Usage', val: 54 },
    { name: 'Support Tickets', val: 42 },
  ];
  const confMatrix = [[142, 12], [8, 98]];
  return (
    <div className="w-full h-full bg-[#0E2931] p-3 flex flex-col gap-2 overflow-hidden">
      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {[['Accuracy','94.2%','#2B7574'],['Precision','91.8%','#7acac8'],['Recall','96.1%','#2B7574'],['F1 Score','0.938','#7acac8']].map(([l,v,c]) => (
          <div key={l as string} className="rounded-lg p-2 text-center" style={{ background: 'rgba(18,72,76,0.7)', border: `1px solid ${c as string}33` }}>
            <p className="text-[8px] uppercase tracking-widest text-[#E2E2E0]/50">{l as string}</p>
            <p className="text-sm font-extrabold mt-0.5" style={{ color: c as string }}>{v as string}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-5 gap-2 min-h-0">
        {/* Feature importance */}
        <div className="col-span-3 rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
          <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest shrink-0">Feature Importance</p>
          <div className="flex-1 overflow-hidden space-y-1.5">
            {featureImportance.map((f, i) => (
              <div key={f.name} style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-[#E2E2E0]/70">{f.name}</span>
                  <span className="text-[8px] font-bold text-[#7acac8]">{f.val}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#0E2931]/80">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${f.val}%`,
                      background: `linear-gradient(90deg, #2B7574, #7acac8)`,
                      transition: `width 1s ease ${i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Confusion matrix */}
        <div className="col-span-2 rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(18,72,76,0.6)', border: '1px solid rgba(43,117,116,0.2)' }}>
          <p className="text-[9px] font-bold text-[#E2E2E0]/70 uppercase tracking-widest">Confusion Matrix</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1 w-full">
              {confMatrix.flat().map((v, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-sm font-extrabold"
                  style={{
                    background: i === 0 || i === 3 ? 'rgba(43,117,116,0.4)' : 'rgba(224,117,117,0.2)',
                    color: i === 0 || i === 3 ? '#7acac8' : '#e07575',
                    border: `1px solid ${i === 0 || i === 3 ? 'rgba(43,117,116,0.4)' : 'rgba(224,117,117,0.3)'}`,
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-[8px]"><span className="text-[#E2E2E0]/50">True Positives</span><span className="text-[#7acac8] font-bold">142</span></div>
            <div className="flex justify-between text-[8px]"><span className="text-[#E2E2E0]/50">True Negatives</span><span className="text-[#7acac8] font-bold">98</span></div>
            <div className="flex justify-between text-[8px]"><span className="text-[#E2E2E0]/50">False Positives</span><span className="text-[#e07575] font-bold">12</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Slide 4 — Data Notebook */
const SlideNotebook = () => {
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 600);
    return () => clearInterval(t);
  }, []);

  const cells = [
    { type: 'md', content: '## Sales Analysis — Q4 2025\nUsing DVAN.AI AI Copilot to analyze revenue trends.' },
    { type: 'code', content: `df = load_dataset("sales_q4.csv")\ndf.head()  # 12,842 rows × 18 cols` },
    { type: 'output', content: 'Dataset loaded: 12,842 rows × 18 columns\nDate range: Oct 1 – Dec 31, 2025\nMissing values: 0.3%' },
    { type: 'code', content: `insights = ai.analyze(df, goal="revenue_growth")\nprint(insights.summary)` },
    { type: 'ai', content: '🧠 AI: Revenue peaked Week 47 (+34%). Top region: APAC. Recommend Q1 focus on upsell pipeline.' },
  ];

  return (
    <div className="w-full h-full bg-[#0a1a22] p-3 flex flex-col gap-1.5 overflow-hidden font-mono">
      <div className="flex items-center gap-2 shrink-0 mb-1">
        <div className="flex gap-1">
          {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
        </div>
        <span className="text-[9px] text-[#E2E2E0]/50">sales_analysis.ipynb</span>
        <div className="ml-auto flex items-center gap-1 text-[8px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Kernel Ready
        </div>
      </div>
      {cells.map((cell, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden shrink-0"
          style={{ animation: `fadeUp 0.3s ease ${i * 0.1}s both` }}
        >
          {cell.type === 'md' && (
            <div className="px-3 py-2" style={{ background: 'rgba(43,117,116,0.06)', borderLeft: '2px solid #2B7574' }}>
              <p className="text-[9px] text-[#7acac8] font-bold">{cell.content.split('\n')[0].replace('## ','')}</p>
              <p className="text-[8px] text-[#E2E2E0]/50 mt-0.5">{cell.content.split('\n')[1]}</p>
            </div>
          )}
          {cell.type === 'code' && (
            <div className="px-3 py-2" style={{ background: 'rgba(14,41,49,0.9)', border: '1px solid rgba(43,117,116,0.2)' }}>
              <div className="flex items-start gap-2">
                <span className="text-[8px] text-[#E2E2E0]/30 mt-0.5 shrink-0">In [{i}]:</span>
                <pre className="text-[9px] text-[#7acac8] leading-relaxed">{cell.content}{i === cells.length - 2 && <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>█</span>}</pre>
              </div>
            </div>
          )}
          {cell.type === 'output' && (
            <div className="px-3 py-1.5" style={{ background: 'rgba(18,72,76,0.3)' }}>
              <pre className="text-[8px] text-[#E2E2E0]/60 leading-relaxed">{cell.content}</pre>
            </div>
          )}
          {cell.type === 'ai' && (
            <div className="px-3 py-2" style={{ background: 'rgba(43,117,116,0.12)', border: '1px solid rgba(43,117,116,0.3)', borderRadius: '0.5rem' }}>
              <p className="text-[9px] text-[#E2E2E0]/80 leading-relaxed">{cell.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** ScreenshotCard now renders an animated slide */
const ScreenshotCard = ({
  src,
  title,
  delay,
}: {
  src: string;
  title: string;
  delay?: number;
}) => {
  const [error, setError] = useState(false);
  const slideMap: Record<string, React.ReactNode> = {
    'AI Dashboard': <SlideAIDashboard />,
    'NLP Workspace': <SlideNLP />,
    'ML Studio': <SlideMLStudio />,
    'Data Notebook': <SlideNotebook />,
  };
  const slide = slideMap[title];

  return (
    <FadeUp delay={delay ?? 0} className="group relative overflow-hidden rounded-2xl border border-[rgba(43,117,116,0.3)] bg-dark-teal shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-500">
      {/* Browser chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0E2931]/80 border-b border-[rgba(43,117,116,0.15)]">
        <span className="w-2.5 h-2.5 rounded-full bg-deep-red/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E0]/40" />
        <span className="w-2.5 h-2.5 rounded-full bg-teal/80" />
        <div className="ml-3 flex-1 bg-[rgba(43,117,116,0.12)] rounded-md h-4 text-[9px] text-[#E2E2E0]/50 flex items-center px-2 truncate border border-[rgba(43,117,116,0.1)]">
          app.dvan.ai · {title}
        </div>
      </div>
      {/* Always show built-in animated slide */}
      <div className="aspect-[16/9] overflow-hidden">
        {slide ?? (
          !error ? (
            <img
              src={src}
              alt={title}
              className="w-full h-full object-cover object-top"
              onError={() => setError(true)}
              loading="lazy"
            />
          ) : (
            <SlideAIDashboard />
          )
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </FadeUp>
  );
};

/** ScreenshotStack — stacked animated cards */
const ScreenshotStack = () => {
  const [deck, setDeck] = useState([0, 1, 2, 3]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const cards = [
    { title: 'AI Dashboard',  slide: <SlideAIDashboard /> },
    { title: 'NLP Workspace', slide: <SlideNLP /> },
    { title: 'ML Studio',     slide: <SlideMLStudio /> },
    { title: 'Data Notebook', slide: <SlideNotebook /> },
  ];

  const handleCardClick = (cardIndex: number) => {
    if (deck[0] !== cardIndex || animatingIndex !== null) return;
    setAnimatingIndex(cardIndex);
    setTimeout(() => {
      setDeck(prev => [...prev.slice(1), prev[0]]);
      setAnimatingIndex(null);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[320px] sm:h-[400px] flex items-center justify-center select-none pt-6 pb-12">
      {deck.map((cardIndex, stackPosition) => {
        const card = cards[cardIndex];
        const isTop = stackPosition === 0;
        const isAnimating = animatingIndex === cardIndex;
        let transformStyle = '';
        let opacityStyle = 1;
        let zIndex = 40 - stackPosition;

        if (isAnimating) {
          transformStyle = 'translate3d(110%, 40px, 0px) scale(0.9) rotate(12deg)';
          opacityStyle = 0.5;
          zIndex = 40;
        } else {
          const scale = 1 - stackPosition * 0.04;
          const translateY = stackPosition * 14;
          const rotate = stackPosition === 0 ? 0 : stackPosition % 2 === 0 ? -1.5 : 1.5;
          transformStyle = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(${rotate}deg)`;
          opacityStyle = 1 - stackPosition * 0.15;
        }

        return (
          <div
            key={cardIndex}
            onClick={() => handleCardClick(cardIndex)}
            style={{ transform: transformStyle, zIndex, opacity: opacityStyle }}
            className={`absolute top-0 w-full transition-all duration-[400ms] ease-in-out cursor-pointer origin-bottom neon-border ${
              isTop ? 'hover:scale-[1.01] hover:-translate-y-1' : 'pointer-events-none'
            }`}
          >
            <div className="rounded-2xl bg-[#12484C] shadow-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0E2931] border-b border-[#2B7574]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="ml-3 flex-1 bg-[rgba(43,117,116,0.12)] rounded-md h-4 text-[9px] text-[#E2E2E0]/60 flex items-center px-2 truncate border border-[rgba(43,117,116,0.15)]">
                  app.dvan.ai · {card.title}
                </div>
                {isTop && (
                  <div className="px-2 py-0.5 rounded bg-[rgba(43,117,116,0.2)] text-[#7acac8] text-[9px] font-bold border border-[rgba(43,117,116,0.3)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7acac8] animate-pulse" />Click to cycle
                  </div>
                )}
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden">
                {card.slide}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Hero screenshot slide — now uses animated built-in slides
───────────────────────────────────────────────────────────────── */
const SLIDE_LABELS = ['Dashboard', 'NLP Workspace', 'ML Studio', 'Notebook'] as const;
const SLIDE_FILES  = ['dashboard', 'nlp', 'ml', 'notebook'] as const;

const HERO_SLIDES: Record<typeof SLIDE_LABELS[number], React.ReactNode> = {
  'Dashboard':     <SlideAIDashboard />,
  'NLP Workspace': <SlideNLP />,
  'ML Studio':     <SlideMLStudio />,
  'Notebook':      <SlideNotebook />,
};

const HeroSlide = ({
  src,
  label,
  filename,
  active,
}: {
  src: string;
  label: typeof SLIDE_LABELS[number];
  filename: typeof SLIDE_FILES[number];
  active: boolean;
}) => {
  return (
    <div className={`absolute inset-0 transition-all duration-700 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}>
      {HERO_SLIDES[label]}
    </div>
  );
};


const SCREENSHOT_PATHS = [
  '/screenshots/dashboard.png',
  '/screenshots/nlp.png',
  '/screenshots/ml.png',
  '/screenshots/notebook.png',
];


/* ─────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: <BarChart2 className="w-5 h-5" />,
    accent: 'badge-teal',
    title: 'Visual Dashboard',
    desc: 'Upload any dataset and instantly receive recommended charts, KPI cards, and interactive dashboards with zero configuration.',
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    accent: 'badge-navy',
    title: 'Local ML Studio',
    desc: 'Train models in your browser. Get feature importance, accuracy metrics, and clear explanations.',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    accent: 'badge-red',
    title: 'Text Analysis Workspace',
    desc: 'Perform local sentiment analysis, keyword extraction, and topic modelling directly in the browser.',
  },
  {
    icon: <Database className="w-5 h-5" />,
    accent: 'badge-teal',
    title: 'Universal Data Parsing',
    desc: 'Handles CSV and Excel formats across any domain. Column profiling detects data types automatically.',
  },
  {
    icon: <LineChart className="w-5 h-5" />,
    accent: 'badge-navy',
    title: 'Comparison Engine',
    desc: 'Compare segments side by side, perform period over period analysis, and cross filter interactions across charts.',
  },
  {
    icon: <Database className="w-5 h-5" />,
    accent: 'badge-teal',
    title: 'Data Assistant',
    desc: 'Ask questions in plain English. The assistant understands your data context and responds directly.',
  },
];

const steps = [
  { icon: <Upload className="w-5 h-5" />, num: '01', title: 'Upload Dataset', desc: 'Drop a CSV or Excel file. The parser auto-detects columns, types, and structure instantly.' },
  { icon: <Database className="w-5 h-5" />, num: '02', title: 'Auto Understanding', desc: 'The AI profiles your data domain—sales, healthcare, finance, research—without any labels.' },
  { icon: <Layers className="w-5 h-5" />, num: '03', title: 'AI Analysis', desc: 'Charts, KPIs, correlations, and anomaly flags are generated in real time.' },
  { icon: <BarChart2 className="w-5 h-5" />, num: '04', title: 'Interactive Dashboard', desc: 'Click, filter, and drill into every insight. All charts are cross-linked.' },
  { icon: <BrainCircuit className="w-5 h-5" />, num: '05', title: 'NLP & ML', desc: 'Run NLP pipelines or train machine learning models in the built-in Notebook.' },
  { icon: <TrendingUp className="w-5 h-5" />, num: '06', title: 'Reports & Insights', desc: 'Export polished PDF reports or discuss findings with the AI Copilot.' },
];

const stats = [
  { value: 6, suffix: '+', label: 'Analysis Modules' },
  { value: 100, suffix: '%', label: 'No-Code Required' },
  { value: 3, suffix: 's', label: 'Avg. Dashboard Time' },
  { value: 12, suffix: '+', label: 'Chart Types' },
];

/* ─────────────────────────────────────────────────────────────────
   Page Component
───────────────────────────────────────────────────────────────── */
const Index = () => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { isLoggedIn, setLoginModalOpen } = useDashboardStore();
  const [activeStep, setActiveStep] = useState(0);
  const [screenshotIdx, setScreenshotIdx] = useState(0);
  const [baScreenshotIdx, setBaScreenshotIdx] = useState(0);
  const navigate = useNavigate();

  const handleFileUpload = (processedData: Record<string, unknown>[]) => {
    if (processedData && processedData.length > 0) {
      setData(processedData);
      setColumns(Object.keys(processedData[0]));
    } else {
      toast.error('No data found in file');
    }
  };

  const handleGetStarted = useCallback(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoggedIn, setLoginModalOpen]);

  const handleOpenBusinessAnalyst = useCallback(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      navigate('/business-analyst');
    }
  }, [isLoggedIn, setLoginModalOpen, navigate]);

  // Auto-cycle screenshot
  useEffect(() => {
    const t = setInterval(() => {
      setScreenshotIdx(i => (i + 1) % SCREENSHOT_PATHS.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle BA screenshot
  useEffect(() => {
    const t = setInterval(() => {
      setBaScreenshotIdx(i => (i + 1) % 4);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle how-it-works
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(i => (i + 1) % steps.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9ff] flex flex-col font-sans antialiased">
      <Navigation />
      <LoginModal />

      {data.length === 0 ? (
        <>
          {/* ══════════════════════════════════════
              HERO
          ══════════════════════════════════════ */}
          <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#0E2931] textile-grain">
            {/* ── Canvas Smoke ── */}
            <SmokeCanvas />

            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0E2931] via-[#0E2931] to-[#12484C] pointer-events-none opacity-80" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[rgba(43,117,116,0.12)] blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[rgba(18,72,76,0.2)] blur-[100px] pointer-events-none" />
            {/* Morph blob */}
            <div className="morph-blob absolute top-1/4 left-1/3 w-[300px] h-[300px] opacity-[0.06] bg-teal-500" />
            {/* Dot grid overlay */}
            <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
            
            {/* SVG Wave Divider at bottom */}
            <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0">
              <svg className="relative block w-full h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,126.3,201.44,120.3,243.32,116.73,283.47,99.51,321.39,56.44Z" className="fill-[#12484C]"></path>
              </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Copy */}
                <div className="space-y-8">
                  <div
                    className="opacity-0 translate-y-4 animate-[fadeUp_0.6s_ease_0.1s_forwards]"
                    style={{ ['--tw-translate-y' as string]: '1rem' }}
                  >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 badge-teal rounded-full text-xs font-semibold tracking-widest uppercase">
                      Data Intelligence Platform
                    </span>
                  </div>

                  <h1 className="opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.2s_forwards] text-[2.8rem] sm:text-[3.6rem] lg:text-[4rem] font-extrabold tracking-tight leading-[1.08] text-[#E2E2E0]">
                    Transform Raw Data<br />
                    Into{' '}
                    <span className="relative inline-block">
                      <span className="text-transparent bg-clip-text text-gradient-teal">
                        Decisions
                      </span>
                      <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-teal to-[#12484C] rounded-full" />
                    </span>
                  </h1>

                  <p className="opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.3s_forwards] text-[#E2E2E0]/70 text-lg leading-relaxed max-w-lg">
                    DVAN.AI is an enterprise-grade, no-code analytics workspace. Upload any structured dataset and immediately access visual dashboards, text analysis pipelines, local model training, and a conversational data assistant.
                  </p>

                  <div className="opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.4s_forwards] flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleGetStarted}
                      className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal hover:bg-[#337e7d] text-[#E2E2E0] font-semibold rounded-xl shadow-[0_8px_24px_-8px_rgba(43,117,116,0.6)] transition-all hover:scale-[1.03] hover:shadow-[0_12px_28px_-8px_rgba(43,117,116,0.8)] text-sm"
                    >
                      {isLoggedIn ? 'Open Workspace' : 'Get Started Free'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                      to="/about"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[rgba(18,72,76,0.3)] hover:bg-[rgba(18,72,76,0.6)] text-[#E2E2E0] font-semibold border border-[rgba(43,117,116,0.2)] rounded-xl transition-all hover:scale-[1.03] text-sm backdrop-blur-sm"
                    >
                      About the Platform
                      <ChevronRight className="w-4 h-4 text-[#E2E2E0]/50" />
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="opacity-0 animate-[fadeUp_0.7s_ease_0.55s_forwards] flex flex-wrap gap-3 pt-2">
                    {['No-Code Required', 'Local NLP Engine', 'Advanced Analytics Engine', 'CSV & Excel Support'].map(t => (
                      <span key={t} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E2E2E0]/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Screenshot Showcase */}
                <div className="relative opacity-0 animate-[fadeLeft_0.9s_ease_0.35s_forwards] hidden lg:block">
                  <div className="relative">
                    {/* Main browser window */}
                    <div className="rounded-2xl border border-[rgba(43,117,116,0.3)] bg-[#12484C] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0E2931]/90 border-b border-[rgba(43,117,116,0.15)]">
                        <span className="w-3 h-3 rounded-full bg-deep-red/80" />
                        <span className="w-3 h-3 rounded-full bg-[#E2E2E0]/40" />
                        <span className="w-3 h-3 rounded-full bg-teal/80" />
                        <div className="ml-2 flex-1 bg-[rgba(43,117,116,0.12)] rounded h-5 text-[10px] text-[#E2E2E0]/50 flex items-center px-3 border border-[rgba(43,117,116,0.1)]">
                          app.dvan.ai/dashboard
                        </div>
                      </div>
                      <div className="relative aspect-[16/10] bg-[#0E2931] overflow-hidden">
                        {SCREENSHOT_PATHS.map((src, i) => (
                          <HeroSlide
                            key={src}
                            src={src}
                            label={(['Dashboard', 'NLP Workspace', 'ML Studio', 'Notebook'] as const)[i]}
                            filename={(['dashboard', 'nlp', 'ml', 'notebook'] as const)[i]}
                            active={i === screenshotIdx}
                          />
                        ))}
                        {/* Dot indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {SCREENSHOT_PATHS.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setScreenshotIdx(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === screenshotIdx ? 'bg-teal w-4' : 'bg-[#E2E2E0]/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -left-8 top-1/3 bg-[#12484C] rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] border border-[rgba(43,117,116,0.3)] p-3 flex items-center gap-2.5 animate-float backdrop-blur-md">
                      <div className="w-8 h-8 badge-teal rounded-lg flex items-center justify-center">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#E2E2E0]/50">Accuracy</p>
                        <p className="text-sm font-bold text-[#E2E2E0]">83.7% R²</p>
                      </div>
                    </div>
                    <div className="absolute -right-6 bottom-1/4 bg-[#12484C] rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] border border-[rgba(43,117,116,0.3)] p-3 flex items-center gap-2.5 animate-float animation-delay-1000 backdrop-blur-md">
                      <div className="w-8 h-8 badge-teal rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#E2E2E0]/50">Sentiment</p>
                        <p className="text-sm font-bold text-[#E2E2E0]">Positive 72%</p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 bg-[#12484C] rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] border border-[rgba(43,117,116,0.3)] p-3 flex items-center gap-2.5 animate-float animation-delay-500 backdrop-blur-md">
                      <div className="w-8 h-8 badge-navy rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#E2E2E0]/50">AI Insight</p>
                        <p className="text-sm font-bold text-[#E2E2E0]">Ready</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              STATS BAR
          ══════════════════════════════════════ */}
          <section className="border-y border-border bg-background py-10">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map(s => (
                <FadeUp key={s.label} className="space-y-1 hover:animate-jump-3d p-4 rounded-2xl transition-all cursor-default">
                  <p className="text-3xl font-extrabold text-primary">
                    <Counter end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════
              AI BUSINESS ANALYST (NEW)
          ══════════════════════════════════════ */}
          <section className="py-24 px-6 bg-[#0E2931] text-[#E2E2E0] overflow-hidden relative textile-grain">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(43,117,116,0.12)] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgba(134,18,17,0.1)] rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <FadeUp className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(43,117,116,0.15)] border border-[rgba(43,117,116,0.35)] rounded-full text-teal text-xs font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    New Module
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    AI Business Analyst
                  </h2>
                  <p className="text-xl text-[#E2E2E0]/70 font-medium">
                    Turn raw business data into decisions.
                  </p>
                  <p className="text-[#E2E2E0]/50 leading-relaxed max-w-md">
                    Analyze Excel, CSV and business data, discover KPIs, identify operational problems, find root causes, and generate actionable recommendations with AI.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2 pb-4">
                    {['Excel Analysis', 'KPI Intelligence', 'Root Cause Analysis', 'Forecasting', 'Operations', 'AI Insights'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[rgba(18,72,76,0.5)] border border-[rgba(43,117,116,0.2)] rounded-lg text-xs font-medium text-[#E2E2E0]/70">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div onClick={handleOpenBusinessAnalyst} className="inline-block cursor-pointer w-full sm:w-auto mt-4">
                    <Button className="bg-teal hover:bg-[#337e7d] text-[#E2E2E0] font-bold px-8 py-6 rounded-xl text-lg shadow-[0_8px_24px_-8px_rgba(43,117,116,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(43,117,116,0.8)] hover:scale-[1.02] transition-all w-full sm:w-auto">
                      Open Business Analyst
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </FadeUp>
                
                <FadeUp delay={200} className="relative" style={{ perspective: '1000px' }}>
                  <div className="relative aspect-[16/10] w-full group" style={{ transformStyle: 'preserve-3d' }}>
                    {[
                      { src: '/screenshots/ba-dashboard.png', title: 'Data Upload & Preview' },
                      { src: '/screenshots/ba-simulations.png', title: 'What-If Simulations' },
                      { src: '/screenshots/ba-kpi.png', title: 'KPI Intelligence' },
                      { src: '/screenshots/ba-operations.png', title: 'Operational Analytics' }
                    ].map((img, idx) => {
                      const isActive = baScreenshotIdx === idx;
                      const isPrev = (baScreenshotIdx - 1 + 4) % 4 === idx;
                      
                      let transform = 'translateZ(-200px) translateY(40px) scale(0.8) opacity-0';
                      let zIndex = 0;
                      
                      if (isActive) {
                        transform = 'translateZ(0px) translateY(0px) scale(1) opacity-100';
                        zIndex = 20;
                      } else if (isPrev) {
                        transform = 'translateZ(-100px) translateY(-20px) scale(0.9) opacity-40';
                        zIndex = 10;
                      }

                      return (
                        <div 
                          key={idx}
                          className="absolute inset-0 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer"
                          style={{ transform, zIndex }}
                          onClick={() => setBaScreenshotIdx((idx + 1) % 4)}
                        >
                          <div className="h-10 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                            <div className="ml-2 bg-slate-900 px-3 py-1 rounded text-[10px] text-[#E2E2E0]/60 font-mono flex-1 truncate">
                              /business-analyst · {img.title}
                            </div>
                            <div className="flex gap-1">
                              {[0, 1, 2, 3].map((dot) => (
                                <div key={dot} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === dot ? 'bg-teal-500' : 'bg-slate-700'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="absolute inset-0 top-10 bg-[#0E2931] flex items-center justify-center">
                            <img 
                              src={img.src} 
                              alt={img.title}
                              className="w-full h-full object-contain object-top opacity-90 group-hover:opacity-100 transition-opacity"
                              onError={(e) => {
                                // Fallback placeholder if image not found
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                  <div class="flex flex-col items-center text-[#E2E2E0]/70">
                                    <svg class="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p class="text-sm font-bold">${img.title}</p>
                                    <p class="text-[10px]">Save image as ${img.src}</p>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="absolute -bottom-2 right-2 sm:-bottom-6 sm:-right-6 bg-teal text-[#E2E2E0] p-4 rounded-xl shadow-[0_12px_40px_-10px_rgba(43,117,116,0.6)] font-bold flex items-center gap-3 animate-float z-30">
                    <BrainCircuit className="w-6 h-6" />
                    <div>
                      <div className="text-xs opacity-80 uppercase tracking-wider">AI Copilot</div>
                      <div className="text-sm">Active</div>
                    </div>
                  </div>

                </FadeUp>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              FEATURES
          ══════════════════════════════════════ */}
          <section className="py-28 px-6 bg-dark-teal relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
              <FadeUp className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-bold badge-teal rounded-full uppercase tracking-widest">
                  Capabilities
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E2E2E0] tracking-tight">
                  One platform. Every analysis tool you need.
                </h2>
                <p className="text-[#E2E2E0]/60 leading-relaxed">
                  From data upload to executive-ready insights in seconds — no SQL, no Python, no configuration.
                </p>
              </FadeUp>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <FadeUp key={f.title} delay={i * 70}>
                    <Card3D className="h-full" intensity={8}>
                      <div className="group h-full fabric-card p-7 flex flex-col gap-4 holo-shimmer">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.accent} shrink-0`}>
                          {f.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#E2E2E0] mb-1.5 group-hover:text-teal transition-colors">{f.title}</h3>
                          <p className="text-sm text-[#E2E2E0]/60 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </Card3D>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>



          {/* ══════════════════════════════════════
              PRODUCT PREVIEW (screenshot grid)
          ══════════════════════════════════════ */}
          <section className="py-28 px-6 bg-dark-teal relative overflow-hidden">
            {/* SVG Wave Divider at top */}
            <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0 rotate-180">
              <svg className="relative block w-full h-[40px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,126.3,201.44,120.3,243.32,116.73,283.47,99.51,321.39,56.44Z" className="fill-[#0E2931]"></path>
              </svg>
            </div>

            <div className="max-w-6xl mx-auto pt-10 relative z-10">
              <FadeUp className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-bold badge-navy rounded-full uppercase tracking-widest">
                  Product Preview
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E2E2E0] tracking-tight">
                  See DVAN.AI in action
                </h2>
                <p className="text-[#E2E2E0]/60 text-sm leading-relaxed">
                  Add your screenshots to <code className="bg-[rgba(18,72,76,0.8)] px-1.5 py-0.5 rounded text-teal text-xs font-mono">/public/screenshots/</code> and they will appear here automatically.
                </p>
              </FadeUp>

              <ScreenshotStack />
            </div>
          </section>

          {/* ══════════════════════════════════════
              WORKSPACE / UPLOAD CTA
          ══════════════════════════════════════ */}
          <section id="upload-section" className="py-28 px-6 bg-gradient-to-b from-[#12484C] to-[#0E2931] textile-grain relative">
            <div className="max-w-3xl mx-auto relative z-10">
              <FadeUp className="text-center mb-10 space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-bold badge-teal rounded-full uppercase tracking-widest">
                  {isLoggedIn ? 'Workspace' : 'Get Access'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E2E2E0] tracking-tight">
                  {isLoggedIn ? 'Drop your dataset and start analysing' : 'Sign in to unlock the workspace'}
                </h2>
                <p className="text-[#E2E2E0]/60 text-sm leading-relaxed max-w-md mx-auto">
                  {isLoggedIn
                    ? 'Supports CSV and Excel formats. Works with any domain: sales, healthcare, HR, IoT, finance, and research.'
                    : 'Login to access the full AI analytics workspace, NLP tools, ML Studio, and conversational data copilot.'}
                </p>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="fabric-card relative overflow-hidden p-8 sm:p-12">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal to-deep-red" />
                  
                    {isLoggedIn ? (
                      <FileUpload onFileUpload={handleFileUpload} />
                    ) : (
                      <div className="flex flex-col items-center gap-6 py-8">
                        <div className="w-16 h-16 rounded-2xl bg-[rgba(43,117,116,0.1)] border-2 border-dashed border-[rgba(43,117,116,0.3)] flex items-center justify-center text-teal">
                          <Lock className="w-7 h-7" />
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold text-[#E2E2E0]">Workspace is Locked</h3>
                          <p className="text-sm text-[#E2E2E0]/60 max-w-xs leading-relaxed">
                            Create a free account to access the AI dashboard, NLP workspace, and ML Studio.
                          </p>
                        </div>
                        <Button
                          onClick={() => setLoginModalOpen(true)}
                          className="bg-teal hover:bg-[#337e7d] text-[#E2E2E0] font-bold px-8 py-6 rounded-xl shadow-[0_8px_24px_-8px_rgba(43,117,116,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(43,117,116,0.8)] transition-all hover:scale-[1.03]"
                        >
                          Sign In to Unlock
                        </Button>
                        <p className="text-xs text-[#E2E2E0]/40">Demo mode — any credentials will work</p>
                      </div>
                    )}
                  
                </div>
              </FadeUp>
            </div>
          </section>



          {/* ══════════════════════════════════════
              FOOTER
          ══════════════════════════════════════ */}
          <footer className="bg-navy text-[#E2E2E0]/60 pt-16 pb-8 px-6 border-t border-[rgba(43,117,116,0.15)]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                {/* Brand */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img src="/lovable-uploads/logo.png" alt="DVAN.AI Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-[#E2E2E0] text-lg">DVAN.AI</span>
                  </div>
                  <p className="text-sm leading-relaxed max-w-xs">
                    Enterprise-grade AI data intelligence platform. Upload any dataset and transform it into actionable insights without writing code.
                  </p>
                  <div className="flex gap-3 pt-1">
                    {[
                      { href: 'mailto:darya780945@gmail.com', icon: <Mail className="w-4 h-4" /> },
                      { href: 'https://github.com/2KRISHNAYADAV', icon: <Github className="w-4 h-4" /> },
                      { href: 'https://www.linkedin.com/in/krishna-yadav-392b61300', icon: <Linkedin className="w-4 h-4" /> },
                      { href: 'https://www.instagram.com/krishnayaduvansy58/', icon: <Instagram className="w-4 h-4" /> },
                    ].map((l, i) => (
                      <a
                        key={i}
                        href={l.href}
                        target={l.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-dark-teal border border-[rgba(43,117,116,0.2)] hover:bg-teal hover:border-teal flex items-center justify-center text-[#E2E2E0]/70 hover:text-[#E2E2E0] transition-all shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]"
                      >
                        {l.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div>
                  <p className="text-[#E2E2E0] text-sm font-semibold mb-4">Platform</p>
                  <ul className="space-y-2.5 text-sm">
                    {[
                      { label: 'Home', href: '/' },
                      { label: 'About', href: '/about' },
                      { label: 'DATSH.AI', href: 'https://datshdattashodhini.vercel.app/', external: true },
                    ].map(l => (
                      <li key={l.label}>
                        {l.external ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">{l.label}</a>
                        ) : (
                          <Link to={l.href} className="hover:text-teal transition-colors">{l.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <p className="text-[#E2E2E0] text-sm font-semibold mb-4">Contact</p>
                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <a href="mailto:darya780945@gmail.com" className="hover:text-teal transition-colors break-all">
                        darya780945@gmail.com
                      </a>
                    </li>
                    <li>
                      <a href="https://er-krishna-yadav.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                        Portfolio Website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-[rgba(43,117,116,0.15)] pt-8 text-center text-xs">
                <p>© 2025 DVAN.AI. All rights reserved. Built by Krishna Yadav.</p>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <div className="w-full flex-1 pt-16">
          <Dashboard data={data} columns={columns} />
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(1.5rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(2rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animation-delay-500  { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default Index;
