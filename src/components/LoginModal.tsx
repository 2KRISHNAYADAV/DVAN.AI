import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store';
import { toast } from 'sonner';
import { Sparkles, Lock, Mail } from 'lucide-react';

export const LoginModal = () => {
  const { isLoginModalOpen, setLoginModalOpen, setLoggedIn } = useDashboardStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoggedIn(true);
    setLoginModalOpen(false);
    toast.success('Welcome to DVAN.AI!');

    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);

    setIsLoading(false);
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden border-0 bg-transparent shadow-[0_24px_80px_-16px_rgba(0,0,0,0.6)]">
        {/* Background */}
        <div className="relative bg-[#0E2931] border border-[rgba(43,117,116,0.25)] rounded-2xl overflow-hidden">
          {/* Subtle top-right glow */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[rgba(43,117,116,0.12)] blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[rgba(18,72,76,0.2)] blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8">
            <DialogHeader className="space-y-4 text-center mb-6">
              {/* Icon */}
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2B7574] flex items-center justify-center shadow-[0_0_32px_-8px_rgba(43,117,116,0.7)] mb-1">
                <Sparkles className="w-6 h-6 text-[#E2E2E0] animate-soft-pulse" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-[#E2E2E0]">
                Welcome to DVAN.AI
              </DialogTitle>
              <DialogDescription className="text-sm text-[#E2E2E0]/50 leading-relaxed">
                Sign in to access your AI Data Intelligence workspace.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2E2E0]/55 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B7574]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2E2E0]/55 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B7574]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 text-sm shadow-[0_0_24px_-6px_rgba(43,117,116,0.5)] hover:shadow-[0_0_32px_-6px_rgba(43,117,116,0.7)] transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E2E2E0]/30 border-t-[#E2E2E0] animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-xs text-[#E2E2E0]/30 mt-5">
              Demo Mode · Any credentials will authorize access
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};