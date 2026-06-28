import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles, LogIn, UserPlus } from "lucide-react";

export function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setError("");
    setLoading(true);
    try {
      await login("demo@en4bun.vn", "demo123");
    } catch (err: any) {
      // If demo account doesn't exist, create it
      try {
        await register("demo@en4bun.vn", "demo123");
      } catch (e: any) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setError("");
    setLoading(true);
    try {
      await login("admin@en4bun.vn", "admin123");
    } catch (err: any) {
      try {
        await register("admin@en4bun.vn", "admin123");
      } catch (e: any) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border-4 border-purple-100 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-200">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Eng4Bun</h1>
          <p className="text-slate-500 font-medium">Học tiếng Anh vui nhộn</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border-2 border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none transition-colors font-medium"
              placeholder="nhap@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none transition-colors font-medium"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-bold text-sm hover:underline"
          >
            {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm font-bold text-slate-400">Hoặc</span>
            </div>
          </div>

          <button
            onClick={loginAsDemo}
            disabled={loading}
            className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200 rounded-xl font-bold transition-all"
          >
            Vào Bằng Tài Khoản Demo
          </button>
          
          <button
            onClick={loginAsAdmin}
            disabled={loading}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border-2 border-slate-200 rounded-xl font-bold transition-all"
          >
            Vào Bằng Tài Khoản Admin
          </button>
        </div>
      </div>
    </div>
  );
}
