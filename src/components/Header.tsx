import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f1123]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="搜索需求、任务、缺陷..."
            className="w-80 h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm text-slate-300 font-medium">张三</span>
        </div>
      </div>
    </header>
  );
}