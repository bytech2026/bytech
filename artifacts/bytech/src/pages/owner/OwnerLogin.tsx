import { useState } from "react";
import { useLocation } from "wouter";
import { useOwnerLogin, useGetMe } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { ShieldAlert, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OwnerLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { t } = useLang();

  const { data: session, isLoading: sessionLoading } = useGetMe({ query: { retry: false } });

  if (session?.isOwner && !sessionLoading) {
    setLocation("/owner");
    return null;
  }

  const loginMutation = useOwnerLogin({
    mutation: {
      onSuccess: () => {
        toast({ title: "✓", description: t.systemAccess, className: "bg-primary text-primary-foreground border-none" });
        setLocation("/owner");
      },
      onError: () => {
        toast({ title: t.loginFailed, description: t.invalidPassword, variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    loginMutation.mutate({ data: { password } });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="tech-panel w-full max-w-md p-8 md:p-10 rounded-2xl relative z-10">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl font-display font-bold text-center text-white mb-2">{t.systemAccess.toUpperCase()}</h1>
          <p className="text-center text-muted-foreground text-sm mb-8">{t.restrictedArea}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Key className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
                className="w-full bg-background border-2 border-border rounded-lg py-3 ps-12 pe-4 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-mono"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending || !password}
              className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-lg uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {loginMutation.isPending ? "..." : t.login}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground font-mono">{t.ipLogged}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
