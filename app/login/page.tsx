"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerCustomerUser } from "@/public/src/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await loginUser(username, password);
      } else {
        user = await registerCustomerUser({
          username,
          password,
          full_name: fullName,
          email
        });
      }

      // Store user data in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        }),
      );

      // Legacy support for specific pages
      localStorage.setItem("profileName", user.full_name);
      localStorage.setItem("userRole", user.role);

      // Redirect based on role
      if (user.role === "admin" || user.role === "driver") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-200/50 p-12 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2">ISDN</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Integrated Supply Distribution Network
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => { setIsLogin(true); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              First Time
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Identity</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Retail Partner Name"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-bold text-sm"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Dispatch Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@distribution.com"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-bold text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Network Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-bold text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Security Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-bold text-sm"
                disabled={loading}
              />
            </div>



            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 shadow-slate-200 shadow-xl text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? "Synchronise Account" : "Initialize Network Identity"
              )}
            </button>
          </form>

          {/* Policy */}
          <p className="mt-8 text-center text-[8px] font-black uppercase tracking-widest text-slate-300">
            Secured via ISDN End-to-End Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
