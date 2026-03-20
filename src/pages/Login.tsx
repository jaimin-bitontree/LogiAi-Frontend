import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, LogIn, Mail, Sparkles, Globe, TrendingUp, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { z } from "zod";
import toast from "react-hot-toast";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character");

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setEmailErrors([]);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailErrors(err.issues.map((e: z.ZodIssue) => e.message));
      }
      return false;
    }
  };

  const validatePassword = (pwd: string) => {
    try {
      passwordSchema.parse(pwd);
      setPasswordErrors([]);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setPasswordErrors(err.issues.map((e: z.ZodIssue) => e.message));
      }
      return false;
    }
  };

  const handlePasswordBlur = () => {
    if (password.trim()) {
      validatePassword(password);
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      validateEmail(email);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(email.trim(), password);
      toast.success(result.message || "Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error && submitError.message
          ? submitError.message
          : "Login failed. Please try again.";
      toast.error(message);
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
              <p className="mt-4 mb-4 max-w-md text-sm leading-6 text-slate-200/90">
                Track requests, monitor routes, and take action instantly with a live operational view.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Country-Wise Analytics</h3>
                  <p className="mt-1 text-xs text-slate-400">Interactive world map integration to track cargo distributions across 150+ countries.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300 ring-1 ring-blue-400/20">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Revenue Control</h3>
                  <p className="mt-1 text-xs text-slate-400">Monitor total revenue and financial metrics with real-time multi-currency support.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
                  <Bell className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Shipment Alerts</h3>
                  <p className="mt-1 text-xs text-slate-400">Stay updated with instant reminders and notifications for pending and confirmed requests.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">
                Unified control for <span className="text-cyan-400">LogiAI</span> premium enterprise operations.
              </p>
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
                      onBlur={handleEmailBlur}
                      placeholder="admin@logiai.com"
                      className={`w-full rounded-xl border ${
                        emailErrors.length > 0 ? "border-red-300" : "border-slate-200"
                      } bg-white pl-10 pr-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${
                        emailErrors.length > 0 ? "focus:ring-red-600" : "focus:ring-cyan-600"
                      } focus:border-transparent`}
                      autoComplete="email"
                    />
                  </div>
                  {emailErrors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {emailErrors.map((err, idx) => (
                        <p key={idx} className="text-xs text-red-600">
                          - {err}
                        </p>
                      ))}
                    </div>
                  )}
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Password</span>
                  <div className="mt-1.5 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onBlur={handlePasswordBlur}
                      placeholder="Enter your password"
                      className={`w-full rounded-xl border ${
                        passwordErrors.length > 0 ? "border-red-300" : "border-slate-200"
                      } bg-white pl-10 pr-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${
                        passwordErrors.length > 0 ? "focus:ring-red-600" : "focus:ring-cyan-600"
                      } focus:border-transparent`}
                      autoComplete="current-password"
                    />
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <p key={idx} className="text-xs text-red-600">
                          • {err}
                        </p>
                      ))}
                    </div>
                  )}
                </label>

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
