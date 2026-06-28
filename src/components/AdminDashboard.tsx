import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Users, Star, Trophy, Clock, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || "Failed to load users. Please check Firestore security rules.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds) return "0p 0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
              <Users className="w-10 h-10 text-purple-600" />
              Quản Trị Viên
            </h1>
            <p className="text-slate-500 font-medium mt-2">Quản lý người chơi Eng4Bun</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-bold shadow-sm"
          >
            <LogOut className="w-5 h-5" /> Đăng Xuất
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border-2 border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Người chơi</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Vai trò</th>
                  <th className="px-6 py-4 font-bold text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" /> Sao
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-emerald-500" /> Điểm
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" /> Thời gian học
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                      Chưa có người chơi nào
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl border-2 border-slate-200">
                            {u.avatar || "👤"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{u.email}</div>
                            <div className="text-xs text-slate-500">{u.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'demo' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {u.stars || 0}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {u.points || 0}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {formatTime(u.playTime)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
