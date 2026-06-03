import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Kanban, Bug, GitBranch, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '项目仪表盘' },
  { to: '/requirements', icon: FileText, label: '需求管理' },
  { to: '/tasks', icon: Kanban, label: '任务看板' },
  { to: '/defects', icon: Bug, label: '缺陷管理' },
  { to: '/traceability', icon: GitBranch, label: '追溯矩阵' },
  { to: '/sprints', icon: Calendar, label: '迭代管理' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0f1123] border-r border-white/5 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">DT</span>
        </div>
        {!collapsed && <span className="text-white font-bold text-lg tracking-tight">DevTrack</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 border-t border-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}