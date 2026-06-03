import { ReactNode } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export default function StatCard({ icon, label, value, sub, trend, color }: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group cursor-default">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</div>
      <div className="flex items-center gap-1.5">
        <span
          className={`text-xs font-medium ${
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'
          }`}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {sub}
        </span>
      </div>
    </div>
  );
}