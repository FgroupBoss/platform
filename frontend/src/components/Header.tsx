import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f1123]/80 backdrop-blur-sm">
      <p className="text-sm text-slate-500">家庭幼儿文化启蒙</p>

      <Link
        to="/admin"
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        title="管理后台"
      >
        <Settings size={16} />
        <span>管理</span>
      </Link>
    </header>
  );
}
