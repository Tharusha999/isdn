"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem('authUser');
    if (storedAuth) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center animate-pulse shadow-2xl shadow-indigo-200">
          <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">ISDN</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">
            Synchronising Network Access...
          </p>
        </div>
      </div>
    </div>
  );
}
