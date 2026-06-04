import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { adminLogin } from '../../api/admin';
import { ApiError, getToken, setToken } from '../../api/client';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getToken()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await adminLogin(username, password);
      setToken(result.token);
      const from = (location.state as { from?: string })?.from || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-[#0f1123] border border-white/10">
        <h1 className="text-xl font-bold text-white text-center">管理后台登录</h1>
        <p className="text-xs text-slate-500 text-center">默认账号 admin / admin123</p>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <div>
          <label className="block text-sm text-slate-400 mb-1">用户名</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 disabled:opacity-50"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
