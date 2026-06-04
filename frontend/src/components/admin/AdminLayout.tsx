import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ScrollText, BookOpen, Film, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { clearToken } from '../../api/client';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '概览', end: true },
  { to: '/admin/poems', icon: ScrollText, label: '诗词管理' },
  { to: '/admin/stories', icon: BookOpen, label: '故事管理' },
  { to: '/admin/media', icon: Film, label: '媒体库' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-200 flex">
      <aside className="w-56 bg-[#0f1123] border-r border-white/5 flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-white/5">
          <span className="font-bold text-white">管理后台</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-white/5 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-slate-300">
            <Home size={16} /> 返回家庭端
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-red-400"
          >
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
