import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, LogIn, Mail, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectPath = state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error && submitError.message
          ? submitError.message
          : "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-4 sm:p-6">
      <div className="pointer-events-none absolute -top-20 -left-14 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/15 bg-white/8 shadow-[0_20px_80px_rgba(2,8,23,0.45)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-linear-to-br from-slate-900/70 to-cyan-950/55 p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-100/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                LOGI AI CONTROL CENTER
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight text-white">
                Smart logistics operations,
                <span className="text-cyan-300"> one unified dashboard.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-200/90">
                Track requests, monitor routes, and take action instantly with a live operational view.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Truck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Live Tracking</p>
                </div>
                <p className="mt-2 text-xs text-slate-200/85">Real-time shipment visibility across all modes.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                <div className="flex items-center gap-2 text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Secure Access</p>
                </div>
                <p className="mt-2 text-xs text-slate-200/85">Role-aware and session-protected admin access.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/96 p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600">
                  <LogIn className="h-3.5 w-3.5" />
                  ADMIN LOGIN
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-500">Sign in to continue to your logistics dashboard.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email Address</span>
                  <div className="mt-1.5 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@logiai.com"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Password</span>
                  <div className="mt-1.5 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                      autoComplete="current-password"
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-700 to-sky-700 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/25 transition-all hover:from-cyan-800 hover:to-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Protected admin access for Logi AI operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
